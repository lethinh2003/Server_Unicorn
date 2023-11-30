const CART_PAYMENT_METHOD = {
  CASH: "cash",
  BANKING: "banking",
};
const ONLINE_PAYMENT_TYPE = {
  VNPAY: "vnpay",
};
const SHIPPING_COST = 30000;

const ORDER_STATUS = {
  PENDING: "pending",
  PAYMENT_PENDING: "payment_pending",
  DELIVERING: "delivering",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

module.exports = { CART_PAYMENT_METHOD, SHIPPING_COST, ORDER_STATUS, ONLINE_PAYMENT_TYPE };
