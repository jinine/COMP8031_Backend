const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/') // Destination folder for storing files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Endpoint for file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  res.send('File uploaded successfully');
});

// Endpoint to get list of images
app.get('/images', (req, res) => {
  fs.readdir('images/', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading images directory');
    }
    const images = files.filter(file => {
      return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif');
    });
    res.json(images);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
