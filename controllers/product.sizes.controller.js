"use strict";

const ProductSizesService = require("../services/product.sizes.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/success_response");

class ProductSizesController {
  getAllSizes = catchAsync(async (req, res, next) => {
    const results = await ProductSizesService.getAllSizes({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
}

module.exports = new ProductSizesController();
