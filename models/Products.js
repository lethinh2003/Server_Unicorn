const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { PRODUCT_GENDERS } = require("../configs/config.product.genders");

const COLLECTION_NAME = "Products";
const productSchema = new mongoose.Schema(
  {
    parent_product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
    },
    product_name: {
      type: String,
      trim: true,
      required: [true, PRODUCT_MESSAGES.NAME_MISSING],
    },
    product_color: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductColors",
      required: [true, PRODUCT_MESSAGES.COLOR_MISSING],
    },
    product_sizes: [
      {
        size_type: {
          type: mongoose.Schema.ObjectId,
          ref: "ProductSizes",
          required: [true, PRODUCT_MESSAGES.SIZE_MISSING],
        },
        size_quantities: {
          type: Number,
          default: 1,
        },
      },
    ],
    product_sale_event: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductSales",
    },
    product_categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "ProductCategories",
      },
    ],
    product_images: [
      {
        type: String,
      },
    ],
    product_gender: {
      type: String,
      enum: [PRODUCT_GENDERS.MEN, PRODUCT_GENDERS.WOMEN, PRODUCT_GENDERS.UNISEX],
      default: PRODUCT_GENDERS.UNISEX,
    },
    product_original_price: {
      type: Number,
      default: 0,
    },

    product_description: [
      {
        type: {
          type: String,
        },
        content: {
          type: String,
        },
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

productSchema.index({ product_name: "text" });

const Products = mongoose.model(COLLECTION_NAME, productSchema);
module.exports = Products;
