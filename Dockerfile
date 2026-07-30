# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system packages required for Python dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt-get/lists/*

# Copy requirements and install
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app source code
COPY backend/ ./

EXPOSE 8000

# Start Uvicorn server on specified PORT or default 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
