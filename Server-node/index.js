const express = require('express');
const app = express();

// Specify the directory path where your webpage files are located
const directoryPath = '../Page';

// Serve the static files from the specified directory
app.use(express.static(directoryPath));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
