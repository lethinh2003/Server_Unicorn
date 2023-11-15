const mongoose = require("mongoose");
const COLLECTION_NAME = "Carts";
const cartsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      unique: true,
    },
    voucher: {
      type: mongoose.Schema.ObjectId,
      ref: "Vouchers",
    },
    totalAmount: {
      type: Number,
      default: 0,
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

const Carts = mongoose.model(COLLECTION_NAME, cartsSchema);
module.exports = Carts;
