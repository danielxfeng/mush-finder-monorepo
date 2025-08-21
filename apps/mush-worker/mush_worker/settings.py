import os
import uuid
from typing import Any, Literal, Union

from pydantic import AnyHttpUrl, Field, RedisDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def is_env_prod() -> bool:
    return os.getenv("ENV", "development") == "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env" if is_env_prod() else ".env.sample")

    model_url: str = Field(..., alias="MODEL_URL")

    sentry_dsn: str = Field(..., alias="SENTRY_DSN")

    cors_origins: Union[list[AnyHttpUrl], Literal["*"]] = Field(..., alias="CORS_ORIGINS")
    api_key: uuid.UUID = Field(..., alias="API_KEY")

    redis_url: RedisDsn = Field(..., alias="REDIS_URL")
    tasks_key: str = Field(..., alias="TASKS_KEY")
    queue_key: str = Field(..., alias="QUEUE_KEY")
    result_ttl: int = Field(..., alias="RESULT_TTL")

    workers: int = Field(..., alias="WORKERS")
    max_retry_count: int = Field(..., alias="MAX_RETRY_COUNT")
    task_timeout: int = Field(..., alias="TASK_TIMEOUT")

    img_url_prefix: str = Field(..., alias="IMG_URL_PREFIX")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def normalize_cors(cls, v: Any) -> Union[list[AnyHttpUrl], Literal["*"]]:
        if isinstance(v, str):
            v = v.strip()
            if v == "*":
                return "*"
            v = [s.strip() for s in v.split(",") if s.strip()]
        return v

    @property
    def is_prod(self) -> bool:
        return is_env_prod()


settings = Settings()  # type: ignore[call-arg]

__all__ = ["settings"]
