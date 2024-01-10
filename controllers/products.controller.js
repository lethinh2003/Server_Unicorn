"use strict";

const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
class ProductsController {
  getAllProducts = catchAsync(async (req, res, next) => {
    const results = await ProductsService.findAllProducts({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
  getAllParentProducts = catchAsync(async (req, res, next) => {
    const { category = "all", gender, page, itemsOfPage, color = "all", size = "all" } = req.query;
    const results = await ProductsService.getAllParentProducts({
      itemsOfPage,
      page,
      category,
      gender,
      color,
      size,
    });
    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        page: page * 1,
        limit: itemsOfPage * 1,
        results: results.length,
      },
    }).send(res);
  });
  getLatestProducts = catchAsync(async (req, res, next) => {
    const { page, itemsOfPage } = req.query;

    const results = await ProductsService.getLatestProducts({
      page,
      itemsOfPage,
    });

    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        page: page * 1,
        limit: itemsOfPage * 1,
        results: results.length,
      },
    }).send(res);
  });
  getSaleProducts = catchAsync(async (req, res, next) => {
    const { page, itemsOfPage } = req.query;

    const results = await ProductsService.getSaleProducts({
      page,
      itemsOfPage,
    });

    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        page: page * 1,
        limit: itemsOfPage * 1,
        results: results.length,
      },
    }).send(res);
  });
  getSuggestProducts = catchAsync(async (req, res, next) => {
    const { productId, itemsOfPage } = req.query;
    const results = await ProductsService.getSuggestProducts({
      productId,
      itemsOfPage,
    });
    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        limit: itemsOfPage * 1,
        results: results.length,
      },
    }).send(res);
  });
  getDetailProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    return new OkResponse({
      data: await ProductsService.getDetailProduct({ productId }),
      metadata: { ...req.params },
    }).send(res);
  });
  createProduct = catchAsync(async (req, res, next) => {
    const {
      parentProductId,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
    } = req.body;

    if (
      !productName ||
      !productColor ||
      !productSizes ||
      !productCategories ||
      !productImages ||
      !productGender ||
      !productOriginalPrice ||
      !productDescription
    ) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await ProductsService.createProduct({
      parentProductId,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
    });

    return new CreatedResponse({
      message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    }).send(res);
  });
}

module.exports = new ProductsController();
