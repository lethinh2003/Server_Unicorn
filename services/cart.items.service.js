"use strict";
const CartItems = require("../models/CartItems");
const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const CartItemRepository = require("../models/repositories/cart.item.repository");
const CartRepository = require("../models/repositories/cart.repository");
const VoucherRepository = require("../models/repositories/voucher.repository");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");
const { removeInvalidProducts } = require("../utils/cartItem");
const ProductRepository = require("../models/repositories/product.repository");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { checkAvailableProduct } = require("../utils/product");
const { checkCartIsValid } = require("../utils/cart");
class CartItemsService {
  static getAllUserCartItems = async ({ userId, options = {} }) => {
    const cart = await checkCartIsValid({ userId });

    const findAllCartItems = await CartItemRepository.findAll({
      query: {
        status: true,
        cart_id: cart._id,
      },
      populate: [
        {
          path: "data.product",
          populate: "product_color product_sale_event",
        },
        { path: "data.size" },
      ],
    });
    // filter all invalid product

    let results = removeInvalidProducts({ listCartItems: findAllCartItems });
    return results;
  };

  static createCartItem = async ({ userId, productId, productQuantities, productSize }) => {
    if (!productId || !productQuantities || !productSize) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check user has a cart?
    const cart = await checkCartIsValid({ userId });
    // Check product is valid
    const product = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });
    if (!product) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    // Check cart has product:
    const checkCartItem = await CartItemRepository.findOne({
      query: {
        user_id: userId,
        "data.product": productId,
        "data.size": productSize,
      },
    });
    if (checkCartItem) {
      throw new BadRequestError(CART_MESSAGES.PRODUCT_IS_EXISTS);
    }

    // Check product quantities
    const checkAvailableProductItem = await checkAvailableProduct({
      productId,
      productQuantities,
      productSize,
    });
    if (!checkAvailableProductItem) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_AVAILABLE);
    }
    const { _doc } = await CartItemRepository.createOne({
      data: {
        cart_id: cart._id,
        user_id: userId,
        data: {
          product: productId,
          size: productSize,
          quantities: productQuantities,
        },
      },
    });
    return _doc;
  };
  static updateQuantitiesCartItem = async ({ userId, cartItemId, productQuantitiesUpdate }) => {
    if (!cartItemId || !productQuantitiesUpdate) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check cart item is valid

    const cartItem = await CartItemRepository.findOne({
      query: {
        user_id: userId,
        _id: cartItemId,
      },
    });
    if (!cartItem) {
      throw new BadRequestError(CART_MESSAGES.CART_ITEM_IS_NOT_VALID);
    }
    // Check product is valid

    const product = await ProductRepository.findOne({
      query: {
        _id: cartItem.data.product,
        status: true,
      },
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });
    if (!product) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    // Check product quantities
    const isAvailableProduct = await checkAvailableProduct({
      productId: cartItem.data.product,
      productQuantities: productQuantitiesUpdate,
      productSize: cartItem.data.size,
    });
    if (!isAvailableProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_AVAILABLE);
    }

    // Update quantites
    await CartItemRepository.findOneAndUpdate({
      query: {
        _id: cartItemId,
      },
      update: {
        $set: {
          "data.quantities": productQuantitiesUpdate,
        },
      },
    });
  };
  static deleteCartItem = async ({ cartItemId, userId }) => {
    if (!cartItemId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check cart item is valid
    const cartItem = await CartItemRepository.findOne({
      query: {
        user_id: userId,
        _id: cartItemId,
      },
    });
    if (!cartItem) {
      throw new BadRequestError(CART_MESSAGES.CART_ITEM_IS_NOT_VALID);
    }

    // delete cart item
    await CartItemRepository.findOneAndDelete({
      query: {
        _id: cartItemId,
        user_id: userId,
      },
    });
  };

  ////
}
module.exports = CartItemsService;
