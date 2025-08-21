from enum import Enum

from pydantic import AnyHttpUrl, BaseModel, Field, field_validator

from mush_finder.settings import settings


class PHash(BaseModel):
    p_hash: str = Field(
        ...,
        title="PHash",
        description="Unique identifier for the task",
        examples=["12345"],
        max_length=64,
        min_length=64,
        pattern=r"^[A-Fa-f0-9]{64}$",
    )


class TaskBody(PHash):
    img_url: AnyHttpUrl = Field(
        ...,
        title="Image URL",
        description="URL of the image to be processed",
        examples=["https://example.com/image.jpg"],
    )

    @field_validator("img_url")
    def must_start_with_prefix(cls, v: AnyHttpUrl) -> AnyHttpUrl:
        if not str(v).startswith(settings.img_url_prefix):
            raise ValueError("img should be uploaded from front-end app")
        return v


class TaskStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    done = "done"
    error = "error"
    not_found = "not_found"


class TaskResult(BaseModel):
    category: str = Field(
        ...,
        title="Category",
        description="Category of the mushroom",
        examples=["mushroom"],
    )
    confidence: float = Field(..., title="Confidence", description="0~1", ge=0.0, le=1.0, examples=[0.95])


class TaskResponse(PHash):
    status: TaskStatus
    result: list[TaskResult] = Field(
        default_factory=lambda: [],
        title="Result",
        description="List of task results",
    )


class HashTask(TaskResponse, TaskBody):
    processed_at: int = Field(ge=0)
    retry_count: int = Field(default=0, ge=0)
