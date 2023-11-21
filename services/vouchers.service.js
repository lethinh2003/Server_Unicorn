"use strict";
const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const Vouchers = require("../models/Vouchers");
const { BadRequestError } = require("../utils/app_error");

class VouchersService {
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await Vouchers.deleteMany({
      user: userId,
    }).session(options?.session || null);
    return data;
  };
  static updateExpiredVouchers = async ({ userId }) => {
    const results = await Vouchers.updateExpiredVouchers({
      userId,
    });
    return results;
  };
  static countAllByUser = async ({ userId }) => {
    const results = await Vouchers.countDocuments({
      user: userId,
      status: true,
    });
    return results;
  };
  static deleteOneById = async ({ userId, voucherId }) => {
    const results = await Vouchers.findOneAndDelete({
      user: userId,
      _id: voucherId,
    });
    return results;
  };
  static updateStatusById = async ({ userId, voucherId, status, options = {} }) => {
    const results = await Vouchers.findOneAndUpdate(
      {
        user: userId,
        _id: voucherId,
      },
      {
        status,
      },
      options
    );
    return results;
  };
  static findByUser = async ({ userId, limitItems, skipItems, sort = "expired_date" }) => {
    const results = await Vouchers.find({
      user: userId,
      status: true,
    })
      .skip(skipItems)
      .limit(limitItems)
      .sort(sort)
      .lean();
    return results;
  };
  static findOneByUserAndId = async ({ userId, voucherId }) => {
    const result = await Vouchers.findOne({
      user: userId,
      _id: voucherId,
      status: true,
    }).lean();
    return result;
  };
  static checkVoucherApplyIsValid = async ({ userId, voucherId, listCartItems = [], options = {} }) => {
    const result = await Vouchers.findOne(
      {
        user: userId,
        _id: voucherId,
        status: true,
      },
      null,
      options
    ).lean();
    if (!result) {
      throw new BadRequestError(VOUCHER_MESSAGES.CODE_IS_NOT_EXISTS);
    }
    // check voucher expired
    const currentDate = new Date();
    const voucherExpiredDate = new Date(result.expired_date);
    if (currentDate > voucherExpiredDate) {
      throw new BadRequestError(VOUCHER_MESSAGES.CODE_IS_EXPIRED);
    }

    const getTotalAmountCartItems = () => {
      let totalPrice = 0;
      listCartItems.forEach((item) => {
        totalPrice += item.data.product.product_original_price * item.data.quantities;
      });
      return totalPrice;
    };
    // Check quantity cart item is ok
    if (listCartItems.length < result.min_order_quantity) {
      throw new BadRequestError(CART_MESSAGES.MIN_ORDER_QUANTITY_VOUCHER_INVALID);
    }
    // Check amount cart item is ok
    if (getTotalAmountCartItems() < result.min_order_amount) {
      throw new BadRequestError(CART_MESSAGES.MIN_ORDER_AMOUNT_VOUCHER_INVALID);
    }
    return result;
  };
  static findOneByUserAndCode = async ({ userId, code }) => {
    const result = await Vouchers.findOne({
      user: userId,
      code: code,
    }).lean();
    return result;
  };
  static createVoucher = async ({ userId, code, discount, description, minOrderQuantity, minOrderAmount, expiredDate, type }) => {
    const result = await Vouchers.create({
      user: userId,
      code,
      discount,
      description,
      min_order_quantity: minOrderQuantity,
      min_order_amount: minOrderAmount,
      expired_date: expiredDate,
      type,
    });

    return result;
  };
}
module.exports = VouchersService;
