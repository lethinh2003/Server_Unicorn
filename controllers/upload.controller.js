"use strict";

const { UPLOAD_MESSAGES } = require("../configs/config.upload.messages");

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const AppError = require("../utils/app_error");
const UploadsService = require("../services/uploads.service");

class UploadController {
  uploadAvatar = catchAsync(async (req, res, next) => {
    const { file } = req;
    if (!file) {
      return next(new UnauthorizedError(UPLOAD_MESSAGES.FILE_REQUIRED));
    }
    const newFilePath = await UploadsService.uploadAvatar({ file });
    const fullUrl = req.protocol + "://" + req.get("host") + "/" + newFilePath;
    return new OkResponse({
      data: fullUrl,
    }).send(res);
  });
}

module.exports = new UploadController();
