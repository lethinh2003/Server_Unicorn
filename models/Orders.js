const mongoose = require("mongoose");
const { ORDER_STATUS, CART_PAYMENT_METHOD } = require("../configs/config.orders");
const COLLECTION_NAME = "Orders";
const ordersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    address: {
      type: Object,
    },
    voucher: {
      type: Object,
    },
    note: {
      type: String,
      default: "",
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    order_status: {
      type: String,
      enum: [ORDER_STATUS.PENDING, ORDER_STATUS.PAYMENT_PENDING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
      default: ORDER_STATUS.PENDING,
    },
    order_method: {
      type: String,
      enum: [CART_PAYMENT_METHOD.CASH, CART_PAYMENT_METHOD.BANKING],
      default: CART_PAYMENT_METHOD.CASH,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const Orders = mongoose.model(COLLECTION_NAME, ordersSchema);
module.exports = Orders;
