"use strict";

const ProductsService = require("../services/products.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class SearchController {
  searchProduct = catchAsync(async (req, res, next) => {
    const { query } = req.query;

    const results = await ProductsService.searchProducts({ query });
    return new OkResponse({
      data: results,
      metadata: {
        query,
        results: results.length,
      },
    }).send(res);
  });
}

module.exports = new SearchController();
