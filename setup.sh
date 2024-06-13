#!/bin/bash

# Navigate to the frontend directory
cd Match_predictions/Frontend/React

# Install npm dependencies and build the frontend
npm install
npm run build

# Navigate back to the project root
cd ../..

# Continue to start the backend with gunicorn
exec gunicorn Match_predictions.Backend.main:app
