# Use lightweight Python 3.11 image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your code
COPY . .

# Expose port for Flask
EXPOSE 8080

# Set environment variable for Flask port
ENV PORT=8080

# Run Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080"]
