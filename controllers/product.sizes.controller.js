"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const ProductSizesService = require("../services/product.sizes.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { comparePassword, hashPassword } = require("../utils/hashPassword");
const { selectFields } = require("../utils/selectFields");
const { OkResponse } = require("../utils/success_response");
const { createToken } = require("../utils/authUtils");

class ProductSizesController {
  getAllSizes = catchAsync(async (req, res, next) => {
    const results = await ProductSizesService.findAllSizes({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
}

module.exports = new ProductSizesController();
