"use strict";
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const FavoriteProducts = require("../models/FavoriteProducts");
const FavoriteProductRepository = require("../models/repositories/favorite.product.repository");
const ProductRepository = require("../models/repositories/product.repository");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");

class FavoriteProductsService {
  static getFavoriteProducts = async ({ userId, itemsOfPage = 10, page = 1 }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await FavoriteProductRepository.find({
      query: {
        user: userId,
      },
      skip: skipItems,
      limit: limitItems,
      sort: "-createdAt",
      populate: {
        path: "product_id",
        populate: {
          path: "product_color product_sale_event",
        },
      },
    });

    const countAllFavoriteProducts = await FavoriteProductRepository.countDocuments({
      query: {
        user: userId,
      },
    });

    return { countAllFavoriteProducts, results, limitItems, currentPage };
  };

  static createFavoriteProduct = async ({ userId, productId }) => {
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    // Check product is exists
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });
    if (!findProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    // Check favorite product is exist
    const findFavoriteProduct = await FavoriteProductRepository.findOne({
      query: {
        user: userId,
        product_id: productId,
      },
    });
    if (findFavoriteProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.FAVORITE_IS_EXISTS);
    }

    const { _doc } = await FavoriteProductRepository.createOne({
      data: {
        user: userId,
        product_id: productId,
      },
    });
    return _doc;
  };

  static getAllFavoriteProducts = async ({ userId }) => {
    const results = await FavoriteProductRepository.findAll({
      query: {
        user: userId,
      },
      populate: {
        path: "product_id",
        select: "_id",
      },
      sort: "-createdAt",
    });

    // only get product_id field
    let newResult = results.flatMap((productId) => productId.product_id);

    return newResult;
  };
  static removeFavoriteProduct = async ({ userId, productId }) => {
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    // Check product is exists
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
    });
    if (!findProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    // Check favorite product is exist
    const findFavoriteProduct = await FavoriteProductRepository.findOne({
      user: userId,
      product_id: productId,
    });
    if (!findFavoriteProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.FAVORITE_IS_NOT_EXISTS);
    }

    await FavoriteProductRepository.findOneAndDelete({
      query: {
        user: userId,
        product_id: productId,
      },
    });
  };

  static checkExistFavoriteProduct = async ({ userId, productId }) => {
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    // Check product is exists
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
    });

    if (!findProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }

    // Check favorite product is exist
    const findFavoriteProduct = await FavoriteProductRepository.findOne({
      user: userId,
      product_id: productId,
    });

    return !!findFavoriteProduct;
  };
  /////
}
module.exports = FavoriteProductsService;
