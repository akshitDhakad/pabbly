const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const multer = require("multer");
const path = require("path");

// apply middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Set up storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for your uploads
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); // Customize the file name
  }
});

const upload = multer({ storage: storage });

// Upload single file
app.post('/upload', upload.single('files'), (req, res) => { // Ensure 'files' matches the name attribute in your FormData
  if (req.file) {
    res.json({
      message: 'File uploaded successfully',
      file: req.file
    });
  } else {
    res.status(400).send('Error: No files were uploaded.');
  }
});

// Optional: Upload multiple files
app.post('/uploadMultiple', upload.array('files', 5), (req, res) => { // Adjust '5' to the max number of files you want to allow
  if (req.files && req.files.length > 0) {
    res.json({
      message: `${req.files.length} files uploaded successfully`,
      files: req.files
    });
  } else {
    res.status(400).send('Error: No files were uploaded.');
  }
});






app.listen(5000, () => {
    console.log("Server has started on port 5000");
})