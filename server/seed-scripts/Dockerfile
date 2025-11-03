FROM python:3.9-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY seed-scripts/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy only what you need for seeder
COPY seed-scripts/ /app/
COPY google_credentials.json /app/google_credentials.json

CMD ["python", "fetch_data_order.py"]
