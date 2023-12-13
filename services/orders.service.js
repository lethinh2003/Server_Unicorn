"use strict";
const { ORDER_STATUS, CART_PAYMENT_METHOD } = require("../configs/config.orders");
const Orders = require("../models/Orders");
const ORDER_QUERY_TYPE = { ...ORDER_STATUS, ALL: "all" };

class OrdersService {
  static findOrders = async ({ userId, limitItems, skipItems, type }) => {
    let results = [];
    if (type === ORDER_QUERY_TYPE.ALL) {
      results = await Orders.find({
        user: userId,
      })
        .skip(skipItems)
        .limit(limitItems)
        .sort("-createdAt")
        .lean();
    } else {
      results = await Orders.find({
        user: userId,
        order_status: type,
      })
        .skip(skipItems)
        .limit(limitItems)
        .sort("-createdAt")
        .lean();
    }

    return results;
  };
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
  static findByIdAndUser = async ({ _id, userId, options = {} }) => {
    const data = await Orders.findOne({
      _id,
      user: userId,
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
    voucher,
    address,
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
      address,
      voucher: voucher,
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
