const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "Carts";
const cartsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Products",
        },
        size: {
          type: mongoose.Schema.ObjectId,
          ref: "ProductSizes",
        },
        quantities: {
          type: Number,
          default: 1,
        },
      },
    ],
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
