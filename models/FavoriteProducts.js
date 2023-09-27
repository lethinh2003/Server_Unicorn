const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const COLLECTION_NAME = "FavoriteProducts";
const favoriteProductsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
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

const FavoriteProducts = mongoose.model(COLLECTION_NAME, favoriteProductsSchema);
module.exports = FavoriteProducts;
