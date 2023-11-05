const mongoose = require("mongoose");
const COLLECTION_NAME = "CartItems";
const cartItemsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      require: true,
    },
    cart_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Carts",
      require: true,
    },
    data: {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        require: true,
      },
      size: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductSizes",
        require: true,
      },
      quantities: {
        type: Number,
        default: 1,
      },
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

const CartItems = mongoose.model(COLLECTION_NAME, cartItemsSchema);
module.exports = CartItems;
