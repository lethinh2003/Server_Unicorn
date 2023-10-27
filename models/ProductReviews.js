const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "ProductReviews";
const productReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    parent_product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
    product_size: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductSizes",
    },
    review_star: {
      type: Number,
      default: 5,
      min: [1, PRODUCT_MESSAGES.REVIEW_STAR_INVALID],
      max: [5, PRODUCT_MESSAGES.REVIEW_STAR_INVALID],
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
