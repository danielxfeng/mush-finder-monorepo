import asyncio
import json
import time
from typing import Awaitable, Callable

import sentry_sdk
from pydantic import ValidationError
from redis.asyncio.client import Redis

from mush_worker.models.HashTask_schema import Model as HashTask
from mush_worker.models.HashTask_schema import Status as TaskStatus
from mush_worker.settings import settings

redis_client: Redis | None = None
SLEEP_INTERVAL = 30  # 30 s


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


TaskHandler = Callable[[HashTask], Awaitable[HashTask]]


async def consume_task(task_handler: TaskHandler) -> None:

    r = get_redis()
    while True:
        try:
            popped = await r.blpop(settings.queue_key, timeout=SLEEP_INTERVAL)
            if not popped:
                try:
                    await r.ping()
                    print("No tasks available, redis is alive")
                except Exception:
                    print("Redis is not reachable")
                    await init_redis()
                    r = get_redis()
                await asyncio.sleep(1)  # Sleep for 1 second before retrying
                continue  # right in / left out, FIFO
        except Exception as e:
            print("Error while popping from Redis:", e)
            await init_redis()
            r = get_redis()
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

        while task.retry_count < settings.max_retry_count:
            task.retry_count += 1
            task.processed_at = int(time.time())

            await r.set(task_key, task.model_dump_json(), ex=settings.result_ttl)

            try:
                result = await asyncio.wait_for(task_handler(task), timeout=settings.task_timeout)
                if result.status == TaskStatus.error:
                    raise ValueError("Task handler returned an error status")
                await r.set(task_key, result.model_dump_json(), ex=settings.result_ttl)
                if (result.status) == TaskStatus.done:
                    break
            except Exception as e:
                sentry_sdk.capture_exception(e)
                result = task
                result.status = TaskStatus.error
                await r.set(task_key, result.model_dump_json(), ex=settings.result_ttl)


__all__ = [
    "health_check",
    "consume_task",
]
