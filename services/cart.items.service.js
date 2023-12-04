"use strict";
const CartItems = require("../models/CartItems");

class CartItemsService {
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await CartItems.deleteMany({
      user_id: userId,
    }).session(options?.session || null);
    return data;
  };
  static findOneById = async ({ userId, cartItemId }) => {
    const result = await CartItems.findOne({
      user_id: userId,
      _id: cartItemId,
    });
    return result;
  };
  static findOneByProduct = async ({ userId, productId, sizeId }) => {
    const result = await CartItems.findOne({
      user_id: userId,
      "data.product": productId,
      "data.size": sizeId,
    });
    return result;
  };
  static findItemsByCart = async ({ cartdId, limitItems, skipItems }) => {
    const results = await CartItems.find({
      cart_id: cartdId,
    })
      .skip(skipItems)
      .limit(limitItems)
      .populate({
        path: "data.product",
        populate: "product_color",
      })
      .populate("data.size")
      .lean();
    return results;
  };
  static findAllByCart = async ({ cartId, options = {} }) => {
    const results = await CartItems.find({
      cart_id: cartId,
    })
      .session(options?.session || null)
      .lean()
      .populate({
        path: "data.product",
        populate: "product_color product_sale_event",
      })
      .populate("data.size");
    return results;
  };
  // Remove all invalid products
  static listRemoveInvalidProducts = ({ listCartItems }) => {
    const results = listCartItems.filter((item) => {
      if (item.data.product !== null) {
        if (item.data.product.status === false) {
          return false;
        }
        return true;
      }
      return false;
    });
    return results;
  };
  static createNewCartItem = async ({ userId, cartId, data }) => {
    const { productId, size, quantities } = data;

    const result = await CartItems.create({
      cart_id: cartId,
      user_id: userId,
      data: {
        product: productId,
        size,
        quantities,
      },
    });

    return result;
  };
  static updateQuantities = async ({ cartItemId, quantitiesUpdate }) => {
    const result = await CartItems.findOneAndUpdate(
      {
        _id: cartItemId,
      },
      {
        $set: {
          "data.quantities": quantitiesUpdate,
        },
      }
    );

    return result;
  };
  static deleteCartItemById = async ({ cartItemId, userId }) => {
    const result = await CartItems.findOneAndDelete({
      _id: cartItemId,
      user_id: userId,
    });

    return result;
  };
  static deleteCartItemsByCartId = async ({ cartId, userId, options = {} }) => {
    const result = await CartItems.deleteMany(
      {
        cart_id: cartId,
        user_id: userId,
      },
      options
    );

    return result;
  };
}
module.exports = CartItemsService;
