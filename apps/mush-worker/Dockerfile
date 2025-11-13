FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/home/user/.cache/huggingface \
    TRANSFORMERS_CACHE=/home/user/.cache/huggingface/transformers \
    PORT=7860

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libjpeg-dev zlib1g-dev libpng-dev git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user

WORKDIR /mush_worker

COPY pyproject.toml poetry.lock* ./
RUN pip install --upgrade pip poetry && \
    poetry config virtualenvs.create false && \
    python -m pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision && \
    poetry install --no-root --only main

COPY --chown=user:user . /mush_worker

USER user

RUN mkdir -p "$HF_HOME" "$TRANSFORMERS_CACHE"

EXPOSE 7860

CMD ["uvicorn", "mush_worker.main:app", "--host", "0.0.0.0", "--port", "7860"]
