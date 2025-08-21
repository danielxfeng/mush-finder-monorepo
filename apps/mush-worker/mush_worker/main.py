import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Callable

import sentry_sdk
from fastapi import FastAPI, Request, Response

from mush_worker.mush_model import mush_model
from mush_worker.redis_service import close_redis, health_check, init_redis
from mush_worker.settings import settings
from mush_worker.utils import close_httpx_client
from mush_worker.worker import worker

if settings.is_prod and settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
    )


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await init_redis()
    mush_model.warmup()
    tasks = [asyncio.create_task(worker()) for i in range(settings.workers)]

    try:
        yield
    finally:
        for t in tasks:
            t.cancel()
        await close_redis()
        await close_httpx_client()


app = FastAPI(lifespan=lifespan)


"""
hugging face removed the cors headers
cors_origins = (
    ["*"]
    if (settings.cors_origins == "*" or not settings.is_prod)
    else [str(origin) for origin in settings.cors_origins]
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
"""


@app.middleware("http")
async def add_security_headers(request: Request, call_next: Callable) -> Response:
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "same-origin"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response


@app.get("/", response_model=dict)
async def root() -> dict:
    return await health_check()
