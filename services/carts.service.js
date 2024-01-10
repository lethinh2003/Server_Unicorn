"use strict";
const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const Carts = require("../models/Carts");
const CartItemRepository = require("../models/repositories/cart.item.repository");
const CartRepository = require("../models/repositories/cart.repository");
const VoucherRepository = require("../models/repositories/voucher.repository");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");

class CartsService {
  static getUserCart = async ({ userId }) => {
    let cart = await CartRepository.findOne({
      query: {
        user: userId,
      },
      populate: {
        path: "voucher",
      },
    });
    // if cart doesn't exist -> create new cart
    if (!cart) {
      const { _doc } = await CartRepository.createOne({
        data: {
          user: userId,
        },
      });
      cart = _doc;
    }
    return cart;
  };
  static checkVoucher = async ({ userId, voucherId }) => {
    if (!voucherId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check user has a cart?
    const checkCartIsExists = await CartRepository.findOne({
      query: {
        status: true,
        user: userId,
      },
      populate: {
        path: "voucher",
      },
    });
    if (!checkCartIsExists) {
      throw new BadRequestError(CART_MESSAGES.CART_IS_NOT_EXISTS);
    }
    // Check voucher is exist
    const checkVoucherIsExists = await VoucherRepository.findOne({
      query: {
        user: userId,
        _id: voucherId,
        status: true,
      },
    });
    if (!checkVoucherIsExists) {
      throw new BadRequestError(VOUCHER_MESSAGES.CODE_IS_NOT_EXISTS);
    }

    const getCartItems = await CartItemRepository.findAll({
      query: {
        cart_id: checkCartIsExists._id,
        status: true,
      },
      populate: [
        {
          path: "data.product",
          populate: "product_color product_sale_event",
        },
        {
          path: "data.size",
        },
      ],
    });

    const getTotalAmountCartItems = () => {
      let totalPrice = 0;
      getCartItems.forEach((item) => {
        totalPrice += item.data.product.product_original_price * item.data.quantities;
      });
      return totalPrice;
    };
    // Check quantity cart item is ok
    if (getCartItems.length < checkVoucherIsExists.min_order_quantity) {
      throw new BadRequestError(CART_MESSAGES.MIN_ORDER_QUANTITY_VOUCHER_INVALID);
    }
    // Check amount cart item is ok
    if (getTotalAmountCartItems() < checkVoucherIsExists.min_order_amount) {
      throw new BadRequestError(CART_MESSAGES.MIN_ORDER_AMOUNT_VOUCHER_INVALID);
    }

    // Update cart

    await CartRepository.findOneAndUpdate({
      query: {
        user: userId,
      },
      update: {
        voucher: voucherId,
      },
    });
  };

  ////
}
module.exports = CartsService;
