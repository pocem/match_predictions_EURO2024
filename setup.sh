#!/bin/bash

# Navigate to the frontend directory
cd Match_predictions/Frontend/React

# Install npm dependencies
npm install

# Install missing peer dependency
npm install @popperjs/core@^2.11.8

# Install vite
npm install vite

# Build the frontend
npm run build

# Navigate back to the project root
cd ../../..

# Continue to start the backend with gunicorn
exec gunicorn Match_predictions.Backend.main:app
