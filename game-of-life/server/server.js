const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('stream/consumers');
const multer = require('multer');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' })); // For JSON payloads
// Enable CORS for all origins
app.use(cors());

//Set multer for file storage.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/'); //Dir to save the file.
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); //Save file with its original name.
  }
})

const upload = multer({ storage: storage });

app.post('/add-world', (req, res) => {
  const filePath = path.join(__dirname, `../data/${req.body.id}.json`);
  const new_world = req.body;

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code == "ENOENT") {
        console.log("File not found, creating a new one");

        const worldJSON = JSON.stringify(new_world, null, 2);
        fs.writeFile(filePath, worldJSON, 'utf-8', (writeError) => {
          if (writeError) {
            // Return immediately after sending the response
            return res.status(500).send(`Error writing to file: ${writeError}`);
          }
          // Return after successfully writing the file
          return res.status(200).send('World successfully added to the database.');
        });
      } else {
        // Return if there is another error reading the file
        return res.status(500).send(`Error reading file: ${err}`);
      }
    } else {
      // File exists, so we proceed to update it
      let currentWorld;
      try {
        currentWorld = JSON.parse(data);
      } catch (parseError) {
        // Return if there's an error parsing the JSON
        return res.status(500).send(`Error parsing JSON data: ${parseError}`);
      }

      // Write the new world data into the file
      fs.writeFile(filePath, JSON.stringify(new_world, null, 2), 'utf-8', (writeError) => {
        if (writeError) {
          // Return if there's an error writing to the file
          return res.status(500).send(`Error writing to file: ${writeError}`);
        }
        // Return after successfully updating the file
        return res.status(200).send('World successfully updated.');
      });
    }
  });
});

//Endpoint to upload a world's image.
app.post('/upload-world-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded.")
  }
  return res.status(200).send("Image saved succesfully");
})


app.get('/get-worlds', (req, res) => {
  const directoryPath = path.join(__dirname, '../data');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send(`Unable to read directory: ${err}`);
    }

    const jsonFiles = files.filter((file) => path.extname(file) === '.json');

    // Map over jsonFiles to create an array of promises for fs.readFile
    const fileReadPromises = jsonFiles.map((file) => {
      const filePath = path.join(directoryPath, file);

      return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            return reject(`Error reading file ${file}: ${err}`);
          }
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            reject(`Error parsing JSON in file ${file}: ${parseError}`);
          }
        });
      });
    });

    // Wait for all file reads to finish
    Promise.all(fileReadPromises)
      .then((worlds) => {
        res.status(200).json(worlds); // Send the collected worlds data
      })
      .catch((error) => {
        res.status(500).send(error); // Handle any errors that occurred
      });
  });
});

app.delete('/delete-world', (req,res) => {
  const jsonFilePath = path.join(__dirname, `../data/${req.body.id}.json`);
  const imageFilePath = path.join(__dirname,`../public/images/${req.body.id}.png`);

  const removeJson = new Promise((resolve, reject) => {
    //Remove json file.
    fs.unlink(jsonFilePath, (err) => {
      if (err) {
        reject(`Error while deleting the JSON file: ${err}`);
      } else {
        resolve('JSON file deleted');
      }
    })
  })

  //Remove image.
  const removeImage = new Promise((resolve, reject) => {
    fs.unlink(imageFilePath, (err) => {
      if (err) {
        reject(`Couldn't delete image: ${err}`)
      } else{
        resolve("Sucesfuly deleted image");
      }
    })
  })

  Promise.all([removeJson,removeImage])
  .then((results) => {
    res.status(200).send('World and image removed successfully.');
  })
  .catch((err) => {
    res.status(500).send(err);
  });

})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
