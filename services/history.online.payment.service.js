"use strict";

const { ONLINE_PAYMENT_TYPE } = require("../configs/config.orders");
const { HistoryOnlinePayments, VNPayPayments } = require("../models/HistoryOnlinePayments");
const { BadRequestError } = require("../utils/app_error");

class HistoryOnlinePaymentsFactory {
  static async createNewHistory({ type, payload }) {
    switch (type) {
      case ONLINE_PAYMENT_TYPE.VNPAY:
        return new VNPayPaymentsService(payload).createNewHistory();

      default:
        throw new BadRequestError("Invalid Online Payment Type");
    }
  }
}

class HistoryOnlinePaymentsService {
  constructor({ user_id, order_id, online_payment_type, data }) {
    this.user_id = user_id;
    this.order_id = order_id;
    this.online_payment_type = online_payment_type;
    this.data = data;
  }
  async createNewHistory() {
    return await HistoryOnlinePayments.create(this);
  }
}
class VNPayPaymentsService extends HistoryOnlinePaymentsService {
  async createNewHistory() {
    const createVNPayPayment = await VNPayPayments.create(this.data);
    if (!createVNPayPayment) {
      throw new BadRequestError("Cannot create history payment");
    }
    const createNewHistoryOnlinePayment = await super.createNewHistory();
    if (!createNewHistoryOnlinePayment) {
      throw new BadRequestError("Cannot create history payment");
    }
    return createNewHistoryOnlinePayment;
  }
}

module.exports = HistoryOnlinePaymentsFactory;
