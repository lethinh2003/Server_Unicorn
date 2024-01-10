"use strict";

const ProductColorsService = require("../services/product.colors.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class ProductColorsController {
  getAllColors = catchAsync(async (req, res, next) => {
    const results = await ProductColorsService.getAllColors({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
}

module.exports = new ProductColorsController();
