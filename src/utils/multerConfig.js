const multer = require('multer');
const path = require('path');

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './kycupload'); // Uploads directory
  },
  filename: function (req, file, cb) {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use original file extension
  }
});

// File filter function to restrict uploads to specific file types if needed
const fileFilter = (req, file, cb) => {
  // Check if the uploaded file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Allow images
  } else if (file.mimetype === 'application/pdf') {
    cb(null, true); // Also allow PDF files
  } else {
    cb(new Error('Only PDF and image files are allowed!'), false);
  }
};

// Initialize multer instance with configuration
const kyc_upload_config = multer({ storage: storage, fileFilter: fileFilter });

module.exports = kyc_upload_config;
