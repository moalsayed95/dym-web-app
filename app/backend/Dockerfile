# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn aiohttp

# Copy the rest of the application
COPY . .

# Create default .env file if .env.docker doesn't exist
RUN if [ -f .env.docker ]; then \
    cp .env.docker .env; \
else \
    touch .env; \
fi

# Expose the port the app runs on
EXPOSE 8765

# Command to run the application
CMD ["gunicorn", "app:create_app", "--bind", "0.0.0.0:8765", "--worker-class", "aiohttp.worker.GunicornWebWorker", "--workers", "4", "--timeout", "120"] 