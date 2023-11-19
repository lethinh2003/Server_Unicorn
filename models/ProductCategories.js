const mongoose = require("mongoose");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { PRODUCT_GENDERS } = require("../configs/config.product.genders");
const COLLECTION_NAME = "ProductCategories";
const productCategorySchema = new mongoose.Schema(
  {
    product_category_parent_id: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductCategories",
    },
    product_category_image: {
      type: String,
    },
    product_category_name: {
      type: String,
      unique: true,
      require: [true, PRODUCT_MESSAGES.CATEGORY_NAME_MISSING],
    },
    product_category_keyword: {
      type: String,
      unique: true,
      require: [true, PRODUCT_MESSAGES.CATEGORY_NAME_MISSING],
    },
    product_category_gender: {
      type: String,
      enum: [PRODUCT_GENDERS.MEN, PRODUCT_GENDERS.WOMEN, PRODUCT_GENDERS.UNISEX],
      default: PRODUCT_GENDERS.UNISEX,
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

const ProductCategories = mongoose.model(COLLECTION_NAME, productCategorySchema);
module.exports = ProductCategories;
