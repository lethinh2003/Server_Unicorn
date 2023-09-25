const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "ProductReviews";
const productReviewSchema = new mongoose.Schema(
  {
    parent_product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
    review_start: {
      type: Number,
      default: 5,
      min: [1, PRODUCT_MESSAGES.REVIEW_START_INVALID],
      max: [5, PRODUCT_MESSAGES.REVIEW_START_INVALID],
    },
    review_comment: {
      type: String,
      require: [true, PRODUCT_MESSAGES.REVIEW_COMMENT_INVALID],
      minlength: [5, PRODUCT_MESSAGES.REVIEW_COMMENT_INVALID],
    },
    review_images: [
      {
        type: String,
      },
    ],
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

const ProductReviews = mongoose.model(COLLECTION_NAME, productReviewSchema);
module.exports = ProductReviews;
