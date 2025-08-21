import asyncio
from contextlib import asynccontextmanager
from typing import Annotated, AsyncGenerator, Callable

import sentry_sdk
from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Path,
    Request,
    Response,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from mush_worker.mush_model import mush_model
from mush_worker.redis_service import (
    close_redis,
    get_or_retry_task,
    health_check,
    init_redis,
    new_redis_task,
)
from mush_worker.schemas import HashTask, PHash, TaskBody, TaskResponse, TaskStatus
from mush_worker.settings import settings
from mush_worker.utils import adaptor_hash_task_to_response, close_httpx_client
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

app.add_middleware(GZipMiddleware, minimum_size=1000, compresslevel=5)


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


async def verify_api_key(x_api_key: Annotated[str, Header()]) -> None:
    if settings.is_prod and settings.api_key and x_api_key.strip() != str(settings.api_key):
        raise HTTPException(status_code=401, detail="Invalid API key")


router = APIRouter(
    prefix="/api",
    tags=["api"],
    responses={404: {"description": "Not found"}},
)


@router.post("/new-task", response_model=TaskResponse, dependencies=[Depends(verify_api_key)])
async def new_task(task: TaskBody) -> TaskResponse:
    hash_task = HashTask(
        p_hash=task.p_hash, img_url=task.img_url, status=TaskStatus.queued, result=[], processed_at=0, retry_count=0
    )

    res = await new_redis_task(hash_task)
    return adaptor_hash_task_to_response(res)


@router.get("/task/{p_hash}", response_model=TaskResponse, dependencies=[Depends(verify_api_key)])
async def get_task(
    p_hash: Annotated[str, Path(title="PHash", description="Unique identifier for the task")],
) -> TaskResponse:
    validated = PHash(p_hash=p_hash)
    res = await get_or_retry_task(validated.p_hash)
    return adaptor_hash_task_to_response(res)


app.include_router(router)
