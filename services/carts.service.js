"use strict";
const Carts = require("../models/Carts");

class CartsService {
  static findAll = async ({ userId, limitItems, skipItems }) => {
    const results = await Carts.find({}).skip(skipItems).limit(limitItems).lean();
    return results;
  };
  static findOneByUser = async ({ userId, populate, options = {} }) => {
    const result = await Carts.findOne(
      {
        user: userId,
      },
      null,
      options
    )
      .populate(populate)
      .lean();
    return result;
  };

  static createCart = async ({ userId }) => {
    const { _doc } = await Carts.create({
      user: userId,
    });
    return _doc;
  };
  static updateCartVoucher = async ({ userId, voucherId }) => {
    const result = await Carts.findOneAndUpdate(
      {
        user: userId,
      },
      {
        voucher: voucherId,
      }
    );
    return result;
  };
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await Carts.findOneAndDelete(
      {
        user: userId,
      },
      options
    );
    return data;
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
