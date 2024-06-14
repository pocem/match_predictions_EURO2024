#!/bin/bash

# Increase Node.js memory limit for npm install
export NODE_OPTIONS=--max_old_space_size=4096


# Navigate to the frontend directory
cd Match_predictions/Frontend/React

# List contents of the current directory
echo "Listing contents of /app/Match_predictions/Frontend/React/:"
ls

# Install npm dependencies for frontend
npm install

# Install missing peer dependency for frontend
npm install @popperjs/core@^2.11.8

# Build the frontend
npm uninstall vite
npm install vite@^4.5.3 

# Navigate back to the project root
cd ../../..

# Ensure Python dependencies are installed (if needed)
pip install -r requirements.txt

# Start the backend with gunicorn
exec gunicorn Match_predictions.Backend.main:app
