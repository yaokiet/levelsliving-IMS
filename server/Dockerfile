# Dockerfile
# Stage 1: Build Stage
# FROM python:3.12-slim AS builder
FROM python:3.9-slim AS builder

# Set the working directory
WORKDIR /app

# Copy only the requirements file to leverage Docker's caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Copy the application code
COPY . .

# Stage 2: Runtime Stage
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy dependencies from the builder stage
COPY --from=builder /install /usr/local

# Copy the application code
COPY . .

# Expose the application port
EXPOSE 8000

# Set the Python path
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["sh", "-c", "python init-scripts/init-db.py && uvicorn main:app --host 0.0.0.0 --port 8000"]