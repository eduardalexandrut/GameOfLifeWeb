const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' })); // For JSON payloads
// Enable CORS for all origins
app.use(cors());

app.post('/add-world', (req, res) => {
  console.log('Received data:', req.body); 
  const filePath = path.join(__dirname, '../data/data.json'); // Absolute path to the JSON file
  const new_world = req.body; // JSON object to be added

  // Read the current data from the file
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return res.status(500).send(`Error when reading the file: ${err}`);
    }

    let jsonArray;
    try {
      jsonArray = JSON.parse(data);
      if (!Array.isArray(jsonArray)) {
        throw new Error('JSON data is not an array');
      }
    } catch (parseError) {
      return res.status(500).send(`Error parsing JSON data: ${parseError}`);
    }
    console.log(jsonArray)

    // Add the new world to the array
    if (!jsonArray.includes(new_world)){
      jsonArray.push(new_world);
    } else {
      jsonArray.map((world) => world.id === new_world.id ? new_world : world)
    }

    // Write the updated array back to the file
    fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), 'utf-8', (writeError) => {
      if (writeError) {
        return res.status(500).send(`Error writing to file: ${writeError}`);
      }
      res.status(200).send('World successfully added to the database.');
    });
  });
});

app.get('/get-worlds', (req, res) => {
  const fileName = path.join(__dirname, "../data/data.json");

  fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send(`Error when opening the file: ${err}`);
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send(`Error while parsing the JSON data: ${parseErr}`);
    }

    res.json(jsonData); // Send the response only once
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
