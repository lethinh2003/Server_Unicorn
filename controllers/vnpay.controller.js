"use strict";

const catchAsync = require("../utils/catch_async");
const sortObject = require("../utils/sortObject");
const VNPayService = require("../services/vnpay.service");

class VNPayController {
  checkIPNVNPay = catchAsync(async (req, res, next) => {
    let vnp_Params = req.query;
    vnp_Params = sortObject(vnp_Params);

    const { responseCode, message } = await VNPayService.checkIPNVNPay({ vnp_Params });

    return res.status(200).json({ RspCode: responseCode, Message: message });
  });
}

module.exports = new VNPayController();
