import io

import httpx
import sentry_sdk
from PIL import Image
from pydantic import AnyUrl

_async_client = httpx.AsyncClient(follow_redirects=True, timeout=10.0)


async def image_download(url: AnyUrl) -> Image.Image | None:
    img_url = str(url).replace("/upload/", "/upload/w_224,h_224,c_fill,q_100/")  # auto resize

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


__all__ = ["image_download", "close_httpx_client"]
