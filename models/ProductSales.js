const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "ProductSales";
const productSaleSchema = new mongoose.Schema(
  {
    sale_event_name: {
      type: String,
      require: [true, PRODUCT_MESSAGES.SALE_EVENT_NAME_INVALID],
      minlength: [5, PRODUCT_MESSAGES.SALE_EVENT_NAME_INVALID],
    },
    sale_discount_percentage: {
      type: Number,
      min: [0, PRODUCT_MESSAGES.SALE_DISCOUNT_PERCENTAGE_INVALID],
      max: [100, PRODUCT_MESSAGES.SALE_DISCOUNT_PERCENTAGE_INVALID],
      default: 0,
    },
    sale_start_date: {
      type: Date,
      default: Date.now,
    },
    sale_end_date: {
      type: Date,
      default: Date.now,
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

const ProductSales = mongoose.model(COLLECTION_NAME, productSaleSchema);
module.exports = ProductSales;
