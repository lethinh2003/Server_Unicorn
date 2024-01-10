"use strict";

const FavoriteProductsService = require("../services/favorite.products.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");

class FavoriteProductsController {
  getFavoriteProducts = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;

    const { results, currentPage, limitItems, countAllFavoriteProducts } = await FavoriteProductsService.getFavoriteProducts({
      userId,
      itemsOfPage,
      page,
    });

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        userId,
        results: results.length,
        countAll: countAllFavoriteProducts,
      },
    }).send(res);
  });
  getAllFavoriteProducts = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const results = await FavoriteProductsService.getAllFavoriteProducts({
      userId,
    });

    return new OkResponse({
      data: results,
      metadata: {
        userId,
        results: results.length,
      },
    }).send(res);
  });
  createFavoriteProduct = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId } = req.body;

    const results = await FavoriteProductsService.createFavoriteProduct({
      userId,
      productId,
    });

    return new CreatedResponse({
      message: PRODUCT_MESSAGES.CREATE_FAVORITE_PRODUCT_SUCCESS,
      metadata: { ...req.body, userId },
      data: results,
    }).send(res);
  });
  removeFavoriteProduct = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId } = req.body;

    const results = await FavoriteProductsService.removeFavoriteProduct({
      userId,
      productId,
    });

    return new OkResponse({
      message: PRODUCT_MESSAGES.DELETE_FAVORITE_PRODUCT_SUCCESS,
      metadata: { ...req.body, userId },
    }).send(res);
  });
  checkExistFavoriteProduct = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId } = req.body;
    const isFavoriteProduct = await FavoriteProductsService.checkExistFavoriteProduct({
      userId,
      productId,
    });

    return new OkResponse({
      data: isFavoriteProduct,
      metadata: {
        ...req.body,
        userId,
      },
    }).send(res);
  });
}

module.exports = new FavoriteProductsController();
