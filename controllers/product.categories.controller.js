"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const ProductCategoriesService = require("../services/product.categories.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { PRODUCT_GENDERS } = require("../configs/config.product.genders");

class ProductCategoriesController {
  getAllCategories = catchAsync(async (req, res, next) => {
    const results = await ProductCategoriesService.findAllCategories({});
    return new OkResponse({
      data: results,
    }).send(res);
  });
  getAllCategoriesByGender = catchAsync(async (req, res, next) => {
    const { gender } = req.query;
    let checkGenderExists = Object.values(PRODUCT_GENDERS).includes(gender);
    if (!checkGenderExists) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    // Find parent category
    const listParentCategories = await ProductCategoriesService.findAllParentCategories({ gender });
    const results = [];
    for (const itemParentCategory of listParentCategories) {
      // Find child categories from parent category
      const listChildCategories = await ProductCategoriesService.findChildCategories({ parentCategoryId: itemParentCategory._id, gender });
      results.push({ ...itemParentCategory, child_categories: listChildCategories });
    }
    return new OkResponse({
      data: results,
      metadata: {
        gender,
      },
    }).send(res);
  });
  getChildCategories = catchAsync(async (req, res, next) => {
    const { parentId, gender } = req.query;

    const results = await ProductCategoriesService.findChildCategories({ parentCategoryId: parentId, gender });
    return new OkResponse({
      data: results,
      metadata: {
        parentId,
        gender,
        results: results.length,
      },
    }).send(res);
  });
  createCategory = catchAsync(async (req, res, next) => {
    const { name, parentCategoryId, keyword, gender } = req.body;
    if (!name || !keyword) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await ProductCategoriesService.createCategory({
      name,
      parentCategoryId,
      keyword,
      gender,
    });
    return new CreatedResponse({
      data: result,
    }).send(res);
  });
}

module.exports = new ProductCategoriesController();
