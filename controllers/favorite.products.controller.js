"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const FavoriteProductsService = require("../services/favorite.products.service");
const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");

class FavoriteProductsController {
  getAllFavoriteProducts = catchAsync(async (req, res, next) => {
    const results = await FavoriteProductsService.findAllFavoriteProducts({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
  getFavoriteProducts = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;

    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await FavoriteProductsService.findFavoriteProductsByUser({
      userId,
      limitItems,
      skipItems,
    });

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        userId,
        results: results.length,
      },
    }).send(res);
  });
  createFavoriteProduct = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId } = req.body;
    if (!productId) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    // Check product is exists
    const findProduct = await ProductsService.findDetailProduct({
      productId,
    });
    if (!findProduct) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }
    // Check favorite product is exist
    const findFavoriteProduct = await FavoriteProductsService.findFavoriteProductByProduct({
      userId,
      productId,
    });
    if (findFavoriteProduct) {
      return next(new BadRequestError(PRODUCT_MESSAGES.FAVORITE_IS_EXISTS));
    }
    const results = await FavoriteProductsService.createFavoriteProduct({
      userId,
      productId,
    });

    return new CreatedResponse({
      data: results,
    }).send(res);
  });
}

module.exports = new FavoriteProductsController();
