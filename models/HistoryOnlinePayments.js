const mongoose = require("mongoose");
const { ONLINE_PAYMENT_TYPE } = require("../configs/config.orders");
const COLLECTION_NAME = "HistoryOnlinePayments";
const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      require: true,
    },
    order_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Orders",
      require: true,
    },
    online_payment_type: {
      type: String,
      enum: [ONLINE_PAYMENT_TYPE.VNPAY],
      default: ONLINE_PAYMENT_TYPE.VNPAY,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      require: true,
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

const vnPaySchema = new mongoose.Schema(
  {
    vnp_TmnCode: {
      type: String,
    },
    vnp_Amount: {
      type: String,
    },
    vnp_BankCode: {
      type: String,
    },
    vnp_BankTranNo: {
      type: String,
    },
    vnp_CardType: {
      type: String,
    },
    vnp_PayDate: {
      type: String,
    },
    vnp_OrderInfo: {
      type: String,
    },
    vnp_TransactionNo: {
      type: String,
    },
    vnp_ResponseCode: {
      type: String,
    },
    vnp_TransactionStatus: {
      type: String,
    },
    vnp_TxnRef: {
      type: String,
    },
  },
  {
    collection: "VNPayPayments",
    timestamps: true,
  }
);

module.exports = {
  HistoryOnlinePayments: mongoose.model(COLLECTION_NAME, schema),
  VNPayPayments: mongoose.model("VNPayPayments", vnPaySchema),
};
