"use strict";
const CryptoJS = require("crypto-js");
const QueryString = require("qs");
const { ORDER_STATUS } = require("../configs/config.orders");
const OrderRepository = require("../models/repositories/order.repository");
class VNPayService {
  static checkIPNVNPay = async ({ vnp_Params }) => {
    let { vnp_TxnRef, vnp_Amount, vnp_ResponseCode, vnp_TransactionStatus, vnp_SecureHash, vnp_TmnCode } = vnp_Params;

    if (!vnp_SecureHash || !vnp_TxnRef || !vnp_Amount || !vnp_ResponseCode || !vnp_TmnCode) {
      return {
        responseCode: "99",
        message: "Unknow error",
      };
    }
    let secureHash = vnp_SecureHash;
    let tmnCode = process.env.VNPAY_TMNCODE || "";
    let secretKey = process.env.VNPAY_HASHSECRET || "";
    vnp_Params["vnp_SecureHash"] = undefined;
    let signData = QueryString.stringify(vnp_Params, { encode: false });
    let signed = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
    if (secureHash !== signed) {
      console.log("Invalid signature");
      return {
        responseCode: "97",
        message: "Invalid signature",
      };
    }
    const checkOrderExist = await OrderRepository.findOne({ query: { _id: vnp_TxnRef } });
    if (!checkOrderExist) {
      console.log("Order not found");
      return {
        responseCode: "01",
        message: "Order not found",
      };
    }
    vnp_Amount = (vnp_Amount * 1) / 100;
    if (checkOrderExist.total !== vnp_Amount) {
      console.log("Invalid amount");
      return {
        responseCode: "04",
        message: "Invalid amount",
      };
    }
    if (checkOrderExist.order_status !== ORDER_STATUS.PAYMENT_PENDING) {
      console.log("Order already confirmed");
      return {
        responseCode: "02",
        message: "Order already confirmed",
      };
    }
    console.log("Confirm Failure");
    // Giao dịch thất bại
    if (vnp_ResponseCode !== "00") {
      return {
        responseCode: vnp_ResponseCode,
        message: "Confirm Failure",
      };
    }
    console.log("Confirm Success");
    // Giao dịch thành công
    return {
      responseCode: "00",
      message: "Confirm Success",
    };
  };
}
module.exports = VNPayService;
