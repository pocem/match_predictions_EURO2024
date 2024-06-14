#!/bin/bash

# Navigate to the frontend directory
cd Match_predictions/Frontend/React

# Install npm dependencies for frontend
npm install

# Install missing peer dependency for frontend
npm install @popperjs/core@^2.11.8

# Build the frontend
npm run build

# Navigate back to the project root
cd ../../..

# Install npm dependencies for backend
npm install --prefix Match_predictions/Backend

# Ensure Python dependencies are installed (if needed)
pip install -r Match_predictions/Backend/requirements.txt

# Start the backend with gunicorn
exec gunicorn Match_predictions.Backend.main:app
