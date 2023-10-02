"use strict";
const Carts = require("../models/Carts");

class CartsService {
  static findAll = async ({ userId, limitItems, skipItems }) => {
    const results = await Carts.find({}).skip(skipItems).limit(limitItems).lean();
    return results;
  };
  static findOneByUser = async ({ userId, populate }) => {
    const result = await Carts.findOne({
      user: userId,
    })
      .populate(populate)
      .lean();
    return result;
  };

  static createCart = async ({ userId }) => {
    const result = await Carts.create({
      user: userId,
      products: [],
    });

    return result;
  };
  static updateProduct = async ({ cartId, product }) => {
    const { product: productId, size, quantities, price } = product;
    const result = await Carts.findOneAndUpdate(
      {
        _id: cartId,
      },
      {
        $push: {
          products: {
            product: productId,
            size,
            quantities,
          },
        },
        $inc: { totalAmount: price },
      }
    );

    return result;
  };
}
module.exports = CartsService;
