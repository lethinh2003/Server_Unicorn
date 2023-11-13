const express = require("express");
const multer = require("multer");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const { UPLOAD_MESSAGES } = require("../configs/config.upload.messages");
const { UPLOAD_PATH } = require("../configs/config.upload.path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH.TEMP_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  } else {
    return cb(new BadRequestError(UPLOAD_MESSAGES.IMAGE_FILE_ONLY));
  }
};
const MAX_SIZE_FILE = 5; // MB
const upload = multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: MAX_SIZE_FILE * 1024 * 1024 } });
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

router.route("/avatar").post(upload.single("avatar"), uploadController.uploadAvatar);
module.exports = router;
