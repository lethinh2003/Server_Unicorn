const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "ProductSizes";
const productSizeSchema = new mongoose.Schema(
  {
    product_size_name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, PRODUCT_MESSAGES.SIZE_NAME_MISSING],
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

const ProductSizes = mongoose.model(COLLECTION_NAME, productSizeSchema);
module.exports = ProductSizes;
