"use strict";
const { ORDER_STATUS, CART_PAYMENT_METHOD } = require("../configs/config.orders");
const Orders = require("../models/Orders");

class OrdersService {
  static updateOneById = async ({ _id, update, options = {} }) => {
    const data = await Orders.findOneAndUpdate(
      {
        _id,
      },
      update,
      options
    );
    return data;
  };
  static findByIdAndUserId = async ({ _id, userId }) => {
    const data = await Orders.findOne({
      _id,
      user: userId,
    }).lean();
    return data;
  };
  static findById = async ({ _id, options = {} }) => {
    const data = await Orders.findOne({
      _id,
    })
      .lean()
      .session(options?.session || null);
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
  static createOrder = async ({
    paymentMethod,
    userId,
    voucherId,
    addressId,
    note,
    subTotal,
    shippingCost,
    discountAmount,
    total,
    options = {},
  }) => {
    const newOrder = new Orders({
      order_method: paymentMethod,
      user: userId,
      address: addressId,
      voucher: voucherId,
      note,
      subTotal,
      shippingCost,
      discountAmount,
      total,
    });
    if (paymentMethod === CART_PAYMENT_METHOD.BANKING) {
      newOrder.order_status = ORDER_STATUS.PAYMENT_PENDING;
    }
    await newOrder.save(options);

    return newOrder;
  };
}
module.exports = OrdersService;
