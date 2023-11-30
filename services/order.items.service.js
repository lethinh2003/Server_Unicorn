"use strict";
const OrderItems = require("../models/OrderItems");

class OrderItemsService {
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await OrderItems.deleteMany({
      user_id: userId,
    }).session(options?.session || null);
    return data;
  };
  static findByOrderId = async ({ orderId, options = {} }) => {
    const data = await OrderItems.find({
      order_id: orderId,
    })
      .lean()
      .session(options?.session || null);
    return data;
  };
  static deleteByOrderId = async ({ orderId, options = {} }) => {
    const data = await OrderItems.deleteMany({
      order_id: orderId,
    }).session(options?.session || null);
    return data;
  };
  static createOrderItem = async ({ userId, orderId, data, options = {} }) => {
    const { productId, size, quantities, totalAmount } = data;
    const newOrderItems = new OrderItems({
      order_id: orderId,
      user_id: userId,
      data: {
        product: productId,
        size,
        quantities,
        totalAmount,
      },
    });
    await newOrderItems.save(options);

    return newOrderItems;
  };
}
module.exports = OrderItemsService;
