from mush_worker.models.HashTask_schema import Model


class TaskResponse(Model):
    processed_at: None = None
    retry_count: None = None