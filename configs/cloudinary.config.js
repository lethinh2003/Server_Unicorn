const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "auto",
    folder: "unicorn",
    public_id: (req, file) => {
      let extensionPath = "";
      if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        extensionPath = ".docx";
      }
      if (file.mimetype === "application/msword") {
        extensionPath = ".doc";
      }
      const fileName = path.parse(file.originalname).name;
      let removeTiengViet = fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      removeTiengViet = removeTiengViet.split(" ").join("_");

      return removeTiengViet + "_" + getRandomInt(100000, 9999999) + extensionPath;
    },
  },
  allowedFormats: ["jpg", "png", "jpeg", "docx", "doc", "pdf"],
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadToCloudinary = async (locaFilePath) => {
  return cloudinary.uploader
    .upload_large(locaFilePath, { unique_filename: false, use_filename: true })
    .then((result) => {
      console.log(result);
      return {
        message: "Success",
        url: result.secure_url,
      };
    })
    .catch((error) => {
      return { message: "Fail" };
    });
};

const uploadCloud = multer({ storage });

module.exports = { uploadCloud, uploadToCloudinary };
