const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Enable CORS for all origins
app.use(cors());

// POST endpoint to handle JSON file uploads
app.post('/upload-world', (req, res) => {
  const jsonData = req.body;

  // Check if jsonData has a 'name' property
  if (!jsonData.name) {
    return res.status(400).send('Invalid data: "name" property is required');
  }

  const filePath = path.join(__dirname, '../game-of-life-data', jsonData.name);
  const fileDir = path.dirname(filePath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  // Write the JSON data to the file
  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving the file');
    }
    res.send('File saved successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
