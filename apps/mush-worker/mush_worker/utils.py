import io

import httpx
import sentry_sdk
from PIL import Image
from pydantic import AnyHttpUrl

from mush_finder.schemas import HashTask, TaskResponse

_async_client = httpx.AsyncClient(follow_redirects=True, timeout=10.0)


def adaptor_hash_task_to_response(task: HashTask) -> TaskResponse:
    return TaskResponse(
        p_hash=task.p_hash,
        status=task.status,
        result=task.result,
    )


async def image_download(url: AnyHttpUrl) -> Image.Image | None:
    img_url = str(url).replace("/upload/", "/upload/w_224,h_224/")  # auto resize

    try:
        img_file = await _async_client.get(img_url)
        img_file.raise_for_status()
        img = Image.open(io.BytesIO(img_file.content)).convert("RGB")
        return img
    except Exception as e:
        sentry_sdk.capture_exception(e)
        return None


async def close_httpx_client() -> None:
    await _async_client.aclose()


__all__ = ["adaptor_hash_task_to_response", "image_download"]
