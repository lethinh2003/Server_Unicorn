const ORDER_MESSAGES = {
  ONLINE_PAYMENT_SUCCESS: "Thanh toán đơn hàng thành công",
  ONLINE_PAYMENT_ERROR: "Có lỗi xảy ra khi thực hiện thanh toán",
  ONLINE_PAYMENT_AMOUNT_INVALID: "Số tiền thanh toán không hợp lệ",
  ONLINE_PAYMENT_ALREADY: "Đơn hàng đang trong tình trạng không cần thanh toán",
  CANNOT_CANCEL: "Đơn hàng đang trong tình trạng không thể hủy đơn",
  ORDER_IS_NOT_EXISTS: "Đơn hàng không tồn tại",
  PAYMENT_METHOD_IS_NOT_EXISTS: "Phương thức thanh toán không hợp lệ",
  CREATE_ORDER_SUCCESS: "Tạo đơn hàng thành công",
  CANCEL_ORDER_SUCCESS: "Hủy đơn hàng thành công",
  MIN_CART_ITEMS_REQUIRED: "Cần tối thiểu một sản phẩm để thanh toán",
  PRODUCT_ITEMS_QUANTITIES_INVALID: "Trong giỏ hàng có sản phẩm không tồn tại (hoặc đã hết hàng)",
};
module.exports = { ORDER_MESSAGES };
