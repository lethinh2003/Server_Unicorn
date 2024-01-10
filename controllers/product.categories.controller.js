"use strict";

const ProductCategoriesService = require("../services/product.categories.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class ProductCategoriesController {
  getAllParentCategoriesByGender = catchAsync(async (req, res, next) => {
    const { gender } = req.query;

    // Find parent category
    const listParentCategories = await ProductCategoriesService.getAllParentCategoriesByGender({ gender });

    return new OkResponse({
      data: listParentCategories,
      metadata: {
        ...req.query,
      },
    }).send(res);
  });
  getAllCategoriesByGender = catchAsync(async (req, res, next) => {
    const { gender } = req.query;
    const results = await ProductCategoriesService.getAllCategoriesByGender({ gender });
    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
      },
    }).send(res);
  });
  getChildCategories = catchAsync(async (req, res, next) => {
    const { parentId, gender } = req.query;

    const results = await ProductCategoriesService.getChildCategories({ parentId, gender });
    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        results: results.length,
      },
    }).send(res);
  });
}

module.exports = new ProductCategoriesController();
