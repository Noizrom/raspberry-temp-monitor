# Use an official Python 3.11 image as a parent image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the Pipfile and Pipfile.lock into the container
COPY Pipfile Pipfile.lock /app/

# Install pipenv
RUN pip install pipenv

# Install Python dependencies using pipenv
RUN pipenv install --deploy --ignore-pipfile

# Copy Only the needed files such as the server.py, dist/, and .env into the container
COPY server.py /app/
COPY dist/ /app/dist/
COPY .env /app/

# Expose port 8000 for FastAPI
EXPOSE 8000

# Start the FastAPI application
CMD ["pipenv", "run", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
