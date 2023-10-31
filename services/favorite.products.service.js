"use strict";
const FavoriteProducts = require("../models/FavoriteProducts");

class FavoriteProductsService {
  static findAllFavoriteProducts = async ({}) => {
    const results = await FavoriteProducts.find({}).lean();
    return results;
  };
  static findFavoriteProductsByUser = async ({ userId, limitItems, skipItems }) => {
    const results = await FavoriteProducts.find({
      user: userId,
    })
      .populate({
        path: "product_id",
        populate: {
          path: "product_color",
        },
      })
      .skip(skipItems)
      .limit(limitItems)
      .lean();
    return results;
  };
  static findAllFavoriteProductsByUser = async ({ userId }) => {
    const results = await FavoriteProducts.find({
      user: userId,
    })
      .populate({
        path: "product_id",
        select: "_id",
      })
      .lean();
    return results;
  };
  static findFavoriteProductByProduct = async ({ userId, productId }) => {
    const result = await FavoriteProducts.findOne({
      user: userId,
      product_id: productId,
    }).lean();
    return result;
  };

  static createFavoriteProduct = async ({ userId, productId }) => {
    const result = await FavoriteProducts.create({
      user: userId,
      product_id: productId,
    });
    return result;
  };
  static deleteFavoriteProduct = async ({ userId, productId }) => {
    const result = await FavoriteProducts.findOneAndDelete({
      user: userId,
      product_id: productId,
    });
    return result;
  };
}
module.exports = FavoriteProductsService;
