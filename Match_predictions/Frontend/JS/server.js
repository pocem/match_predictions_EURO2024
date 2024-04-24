const express = require('express');
const app = express();
const path = require('path');

const PORT = 3003;

// Serve static files from the 'Front JS' directory
app.use(express.static(path.join(__dirname, 'index.html')));

// Define your API routes or other routes here

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});