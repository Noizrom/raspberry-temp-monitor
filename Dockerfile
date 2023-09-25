# Use an official Python 3.11 image as a parent image
FROM python:3.11-slim


# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/

# Install required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy Only the needed files such as the server.py, dist/, and .env into the container
COPY server.py /app/
COPY dist/ /app/dist/
COPY .env /app/

# Check the value of INSTALL_OS and run OS-specific commands
ARG INSTALL_OS
RUN if [ "$INSTALL_OS" = "raspbian" ]; then \
    # Raspberry Pi specific commands here (e.g., vcgencmd) \
    echo "Running on Raspberry Pi"; \
    else \
    # Commands for other OS (e.g., Windows) here \
    echo "Running on another OS"; \
    # Stop the container if the OS is not supported \
    fi


# Expose port 8000 for FastAPI
EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
