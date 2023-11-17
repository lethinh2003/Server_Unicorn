"use strict";
const Orders = require("../models/Orders");

class OrdersService {
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
