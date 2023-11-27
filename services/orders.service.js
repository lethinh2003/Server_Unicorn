"use strict";
const Orders = require("../models/Orders");

class OrdersService {
  static findById = async ({ _id }) => {
    const data = await Orders.findOne({
      _id,
    }).lean();
    return data;
  };
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await Orders.deleteMany({
      user: userId,
    }).session(options?.session || null);
    return data;
  };
  static deleteById = async ({ orderId, options = {} }) => {
    const data = await Orders.deleteOne({
      _id: orderId,
    }).session(options?.session || null);
    return data;
  };
  static createOrder = async ({ userId, voucherId, addressId, note, subTotal, shippingCost, discountAmount, total, options = {} }) => {
    const newOrder = new Orders({
      user: userId,
      address: addressId,
      voucher: voucherId,
      note,
      subTotal,
      shippingCost,
      discountAmount,
      total,
    });
    await newOrder.save(options);

    return newOrder;
  };
}
module.exports = OrdersService;
