const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "ProductColors";
const productColorSchema = new mongoose.Schema(
  {
    product_color_name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, PRODUCT_MESSAGES.COLOR_NAME_MISSING],
    },
    product_color_code: {
      type: String,
      trim: true,
      required: [true, PRODUCT_MESSAGES.COLOR_NAME_MISSING],
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

const ProductColors = mongoose.model(COLLECTION_NAME, productColorSchema);
module.exports = ProductColors;
