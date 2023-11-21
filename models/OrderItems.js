const mongoose = require("mongoose");
const COLLECTION_NAME = "OrderItems";
const orderItemsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      require: true,
    },
    order_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Orders",
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
      totalAmount: {
        type: Number,
        default: 0,
      },
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

const OrderItems = mongoose.model(COLLECTION_NAME, orderItemsSchema);
module.exports = OrderItems;
