#!/bin/bash

# Increase Node.js memory limit for npm install
export NODE_OPTIONS=--max_old_space_size=4096

# Print the current directory
echo "Starting script in directory:"
pwd

# Navigate to the frontend directory
cd Match_predictions/Frontend/React

# Print the current directory
echo "After changing to frontend directory:"
pwd

# List contents of the current directory
echo "Listing contents of /app/Match_predictions/Frontend/React/:"
ls

# Install npm dependencies for frontend
npm install

# Install missing peer dependency for frontend
npm install @popperjs/core@^2.11.8

# Ensure node_modules/.bin is in the PATH
export PATH=$(npm bin):$PATH

# Print the current directory
echo "Before running build:"
pwd

# List contents of the current directory again to verify vite installation
echo "Listing contents after npm install:"
ls

# Build the frontend
npx vite build

# Navigate back to the project root
cd ../../..

# Print the current directory
echo "After changing back to project root:"
pwd

# List contents of the project root
echo "Listing contents of project root:"
ls

# Ensure Python dependencies are installed (if needed)
pip install -r requirements.txt

# Start the backend with gunicorn
exec gunicorn Match_predictions.Backend.main:app
