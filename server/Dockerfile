# Dockerfile
FROM python:3.12-slim

WORKDIR /app # Set the working directory inside the container

COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt 

COPY . . 

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
