"use strict";

const ProductColorsService = require("../services/product.colors.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");

class ProductColorsController {
  getAllColors = catchAsync(async (req, res, next) => {
    const results = await ProductColorsService.findAllColors({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
  createColor = catchAsync(async (req, res, next) => {
    const { name, code } = req.body;
    if (!name || !code) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await ProductColorsService.createColor({
      name,
      code,
    });
    return new CreatedResponse({
      data: result,
    }).send(res);
  });
}

module.exports = new ProductColorsController();
