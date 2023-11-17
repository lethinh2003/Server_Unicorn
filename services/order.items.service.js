"use strict";
const OrderItems = require("../models/OrderItems");

class OrderItemsService {
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