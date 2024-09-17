const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const config = require("root/EasyCalconfig");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API_KEY,
  api_secret: config.CLOUD_API_SECRET,
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Folder name in your Cloudinary account
    format: async (req, file) => "png", // You can use 'jpeg', 'png', etc.
    public_id: (req, file) => `${req.userId}_profile_picture`, // Unique identifier for the file
  },
});

// Configure Multer
const upload = multer({ storage: storage });

module.exports = upload;
