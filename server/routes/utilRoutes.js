const express = require('express');
const multer = require('multer');
const path = require('path');
const { speechToText } = require('../controllers/utilControllers');

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store files in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  },
});

const upload = multer({ storage }); // Use diskStorage

// Define the route for speech-to-text conversion
router.post('/speech-to-text', upload.single('file'), speechToText);

module.exports = router;
