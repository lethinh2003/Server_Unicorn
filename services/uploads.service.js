"use strict";

const sharp = require("sharp");
const { UPLOAD_PATH } = require("../configs/config.upload.path");

const getNameFromFileName = (filename) => {
  const splitName = filename.split(".");
  splitName.pop();
  return splitName.join(".");
};

class UploadsService {
  static uploadAvatar = async ({ file }) => {
    const newPath = UPLOAD_PATH.PRIMARY_DIR + getNameFromFileName(file.filename) + ".jpg";
    await sharp(file.path).jpeg({}).toFile(newPath);

    return newPath;
  };
}
module.exports = UploadsService;
