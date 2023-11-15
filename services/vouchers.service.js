"use strict";
const Vouchers = require("../models/Vouchers");

class VouchersService {
  static countAllByUser = async ({ userId }) => {
    const results = await Vouchers.countDocuments({
      user: userId,
    });
    return results;
  };
  static findByUser = async ({ userId, limitItems, skipItems, sort = "expired_date" }) => {
    const results = await Vouchers.find({
      user: userId,
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
    }).lean();
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
