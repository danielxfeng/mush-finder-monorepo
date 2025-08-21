import asyncio
from concurrent.futures import ThreadPoolExecutor

from mush_worker.models.HashTask_schema import Model as HashTask
from mush_worker.models.HashTask_schema import Status as TaskStatus
from mush_worker.mush_model import mush_model
from mush_worker.redis_service import consume_task
from mush_worker.settings import settings
from mush_worker.utils import image_download

EXECUTOR = ThreadPoolExecutor(max_workers=settings.workers)


async def task_worker(hash_task: HashTask) -> HashTask:
    img = await image_download(hash_task.img_url)

    if not img:
        hash_task.status = TaskStatus.error
        return hash_task

    loop = asyncio.get_running_loop()
    task_result = await loop.run_in_executor(EXECUTOR, mush_model.predict, img, hash_task.p_hash)
    hash_task.status = task_result.status
    hash_task.result = task_result.result
    return hash_task


async def worker() -> None:
    await consume_task(task_worker)


__all__ = ["worker"]
