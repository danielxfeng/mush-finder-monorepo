import asyncio
import json
import time
from typing import Awaitable, Callable, Literal, cast

import sentry_sdk
from pydantic import AnyHttpUrl, ValidationError
from redis.asyncio.client import Redis
from redis.exceptions import WatchError

from mush_finder.schemas import HashTask, TaskStatus
from mush_finder.settings import settings

redis_client: Redis | None = None
SLEEP_INTERVAL = 5


async def init_redis() -> None:
    global redis_client

    redis_client = Redis.from_url(
        str(settings.redis_url),
        decode_responses=True,
        health_check_interval=30,
        retry_on_timeout=True,
    )


async def close_redis() -> None:
    global redis_client
    if redis_client:
        await redis_client.aclose()  # type: ignore[attr-defined]
        redis_client = None


def get_redis() -> Redis:
    if redis_client is None:
        raise RuntimeError("Redis client not initialized")
    return redis_client


async def health_check() -> dict:
    r = get_redis()
    await r.ping()
    return {"message": "ok"}


def _validate_task(task_str: str) -> HashTask | None:
    try:
        return HashTask.model_validate_json(task_str)
    except (ValidationError, json.JSONDecodeError, TypeError, ValueError) as e:
        sentry_sdk.capture_exception(e)
        return None


async def _add_or_retry_task(task: HashTask, mode: Literal["add", "retry"]) -> HashTask:
    r = get_redis()
    task_key = f"{settings.tasks_key}:{task.p_hash}"

    while True:
        pipe = r.pipeline()
        try:
            await pipe.watch(task_key)

            data = await pipe.get(task_key)

            if mode == "add" and data and (validated := _validate_task(data)):
                return validated
            elif mode == "retry" and not data:
                return HashTask(
                    p_hash=task.p_hash,
                    img_url=task.img_url,
                    status=TaskStatus.not_found,
                    result=[],
                    retry_count=0,
                    processed_at=0,
                )

            if mode == "retry":
                task.status = TaskStatus.queued
                task.retry_count += 1

            pipe.multi()
            pipe.set(task_key, task.model_dump_json(), ex=settings.result_ttl)
            pipe.rpush(settings.queue_key, task.p_hash)  # right in / left out, FIFO

            await pipe.execute()
            return task

        except WatchError:
            continue
        finally:
            try:
                await pipe.unwatch()
            except Exception:
                pass
            await pipe.reset()


async def get_or_retry_task(p_hash: str) -> HashTask:
    """Get a task by its p_hash, with retry-on-failure logic.

    Args:
        p_hash (str): The p_hash of the task to retrieve.

    Returns:
        HashTask: The retrieved task.
    """

    r = get_redis()

    data = await r.get(f"{settings.tasks_key}:{p_hash}")
    if not data or not (validated := _validate_task(data)):
        return HashTask(
            p_hash=p_hash,
            img_url=cast(AnyHttpUrl, "https://notfound.image.com/"),
            status=TaskStatus.not_found,
            result=[],
            retry_count=0,
            processed_at=0,
        )

    task = validated

    now = int(time.time())
    is_task_timeout = task.status == TaskStatus.processing and now - task.processed_at >= settings.task_timeout
    is_task_final_err = (
        task.status == TaskStatus.error or is_task_timeout
    ) and task.retry_count >= settings.max_retry_count

    if (
        (task.status in (TaskStatus.done, TaskStatus.queued))
        or (task.status == TaskStatus.processing and not is_task_timeout)
        or is_task_final_err
    ):
        return task

    if task.status == TaskStatus.error or is_task_timeout:
        return await _add_or_retry_task(task, mode="retry")

    raise ValueError(f"Unexpected task status: {task.status}")


async def new_redis_task(task: HashTask) -> HashTask:
    """Create a new task, or return the result if it already exists.
    Idempotent for the same p_hash.

    Args:
        task (HashTask): The task to create.

    Returns:
        HashTask: The created or existing task.
    """

    return await _add_or_retry_task(task, mode="add")


TaskHandler = Callable[[HashTask], Awaitable[HashTask]]


async def consume_task(task_handler: TaskHandler) -> None:
    """Consume tasks from the `queue` in a blocking loop, with a timeout and retry logic.

    Args:
        task_handler (TaskHandler): A function that processes a single task.
    """

    r = get_redis()
    while True:
        popped = await r.blpop(settings.queue_key, timeout=SLEEP_INTERVAL)  # right in / left out, FIFO
        if not popped:
            await asyncio.sleep(SLEEP_INTERVAL)
            continue

        _, p_hash = popped

        task_key = f"{settings.tasks_key}:{p_hash}"

        data = await r.get(task_key)
        if not data:
            continue

        task = _validate_task(data)

        if not task or task.status != TaskStatus.queued:
            continue

        task.status = TaskStatus.processing
        task.processed_at = int(time.time())

        await r.set(task_key, task.model_dump_json(), ex=settings.result_ttl)

        try:
            result = await asyncio.wait_for(task_handler(task), timeout=settings.task_timeout)
            if result.status == TaskStatus.error:
                raise ValueError("Task handler returned an error status")
            await r.set(task_key, result.model_dump_json(), ex=settings.result_ttl)
        except Exception as e:
            sentry_sdk.capture_exception(e)
            result = task
            result.status = TaskStatus.error
            await r.set(task_key, result.model_dump_json(), ex=settings.result_ttl)
            if result.retry_count < settings.max_retry_count:
                await _add_or_retry_task(result, mode="retry")


__all__ = [
    "get_redis",
    "health_check",
    "get_or_retry_task",
    "new_redis_task",
    "consume_task",
]
