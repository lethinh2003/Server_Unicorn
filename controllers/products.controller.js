"use strict";

const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { result } = require("lodash");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");

class ProductsController {
  getAllProducts = catchAsync(async (req, res, next) => {
    const results = await ProductsService.findAllProducts({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
  getAllParentProducts = catchAsync(async (req, res, next) => {
    const { category, gender, page, items_of_page } = req.query;
    const limitItems = items_of_page * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const listParentProducts = await ProductsService.findAllParentProducts({
      category,
      gender,
      skipItems,
      limitItems,
    });
    const results = [];
    for (const product of listParentProducts) {
      const listChildProducts = await ProductsService.findAllChildProductsByParent({
        parent_product_id: product._id,
      });
      results.push({ ...product, child_products: listChildProducts });
    }

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        category,
        results: results.length,
      },
    }).send(res);
  });
  createProduct = catchAsync(async (req, res, next) => {
    const {
      parent_product_id,
      product_name,
      product_color,
      product_sizes,
      product_categories,
      product_images,
      product_gender,
      product_original_price,
      product_description,
    } = req.body;

    if (
      !product_name ||
      !product_color ||
      !product_sizes ||
      !product_categories ||
      !product_images ||
      !product_gender ||
      !product_original_price ||
      !product_description
    ) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await ProductsService.createProduct({
      parent_product_id,
      product_name,
      product_color,
      product_sizes,
      product_categories,
      product_images,
      product_gender,
      product_original_price,
      product_description,
    });

    return new CreatedResponse({
      data: result,
    }).send(res);
  });
}

module.exports = new ProductsController();
