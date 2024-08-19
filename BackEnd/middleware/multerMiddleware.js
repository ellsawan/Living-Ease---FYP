const multer = require('multer');
const path = require('path');

// Set up multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports.singleUpload = upload.single('file');