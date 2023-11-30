"use strict";

const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const CartsService = require("../services/carts.service");
const VouchersService = require("../services/vouchers.service");
const CartItemsService = require("../services/cart.items.service");
const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const UserAddressesService = require("../services/user.addessses.service");
const { CART_PAYMENT_METHOD, SHIPPING_COST, ORDER_STATUS } = require("../configs/config.orders");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const { VOUCHER_TYPES } = require("../configs/config.voucher.types");
const OrdersService = require("../services/orders.service");
const OrderItemsService = require("../services/order.items.service");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const QueryString = require("qs");
const sortObject = require("../utils/sortObject");

class VNPayController {
  checkIPNVNPay = catchAsync(async (req, res, next) => {
    let vnp_Params = req.query;
    vnp_Params = sortObject(vnp_Params);
    let { vnp_TxnRef, vnp_Amount, vnp_ResponseCode, vnp_TransactionStatus, vnp_SecureHash, vnp_TmnCode } = vnp_Params;

    if (!vnp_SecureHash || !vnp_TxnRef || !vnp_Amount || !vnp_ResponseCode || !vnp_TmnCode) {
      return res.status(200).json({ RspCode: "99", Message: "Unknow error" });
    }
    let secureHash = vnp_SecureHash;
    let tmnCode = process.env.VNPAY_TMNCODE || "";
    let secretKey = process.env.VNPAY_HASHSECRET || "";
    vnp_Params["vnp_SecureHash"] = undefined;
    let signData = QueryString.stringify(vnp_Params, { encode: false });
    let signed = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
    console.log(secureHash, signed);
    if (secureHash !== signed) {
      console.log("Invalid signature");
      return res.status(200).json({ RspCode: "97", Message: "Invalid signature" });
    }
    const checkOrderExist = await OrdersService.findById({ _id: vnp_TxnRef });
    if (!checkOrderExist) {
      console.log("Order not found");
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
    vnp_Amount = (vnp_Amount * 1) / 100;
    if (checkOrderExist.total !== vnp_Amount) {
      console.log("Invalid amount");
      return res.status(200).json({ RspCode: "04", Message: "Invalid amount" });
    }
    if (checkOrderExist.order_status !== ORDER_STATUS.PAYMENT_PENDING) {
      console.log("Order already confirmed");
      return res.status(200).json({ RspCode: "02", Message: "Order already confirmed" });
    }
    console.log("Confirm Success");
    // Giao dịch thất bại
    if (vnp_ResponseCode !== "00") {
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    }
    // Giao dịch thành công
    return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
  });
}

module.exports = new VNPayController();
