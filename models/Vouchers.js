const mongoose = require("mongoose");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const { VOUCHER_TYPES } = require("../configs/config.voucher.types");
const COLLECTION_NAME = "Vouchers";
const vouchersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    code: {
      type: String,
      unique: [true, VOUCHER_MESSAGES.CODE_IS_EXISTS],
      required: [true, VOUCHER_MESSAGES.CODE_IS_MISSING],
      trim: true,
      minlength: [8, VOUCHER_MESSAGES.CODE_MIN_LENGTH],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, VOUCHER_MESSAGES.DISCOUNT_INVALID],
      max: [100, VOUCHER_MESSAGES.DISCOUNT_INVALID],
    },
    description: {
      type: String,
      required: [true, VOUCHER_MESSAGES.DESC_IS_MISSING],
      trim: true,
    },
    min_order_quantity: {
      type: Number,
      default: 0,
      min: [0, VOUCHER_MESSAGES.MIN_ORDER_QUANTITY_INVALID],
    },
    min_order_amount: {
      type: Number,
      default: 0,
      min: [0, VOUCHER_MESSAGES.MIN_ORDER_AMOUNT_INVALID],
    },
    expired_date: {
      type: Date,
      default: Date.now,
      // expires: 0,
    },
    type: {
      type: String,
      enum: { values: [VOUCHER_TYPES.FREE_SHIP, VOUCHER_TYPES.AMOUNT], message: VOUCHER_MESSAGES.TYPE_INVALID },
      default: VOUCHER_TYPES.FREE_SHIP,
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
vouchersSchema.statics.updateExpiredVouchers = async function ({ userId }) {
  try {
    const currentDate = new Date();
    const results = await this.updateMany(
      { user: userId, expired_date: { $lt: currentDate }, status: true },
      {
        status: false,
      }
    );
    return results;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const Vouchers = mongoose.model(COLLECTION_NAME, vouchersSchema);

module.exports = Vouchers;
