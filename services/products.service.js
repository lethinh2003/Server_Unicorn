"use strict";
const Products = require("../models/Products");
class ProductsService {
  static findAllProducts = async ({}) => {
    const results = await Products.find({}).lean();
    return results;
  };
  static findAllParentProducts = async ({ category, gender, skipItems, limitItems }) => {
    const results = await Products.find({
      product_categories: category,
      product_gender: gender,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
    })
      .populate("product_color product_sizes.size_type product_categories")
      .limit(limitItems)
      .skip(skipItems)
      .lean();
    return results;
  };
  static findAllChildProductsByParent = async ({ parent_product_id }) => {
    const results = await Products.find({
      parent_product_id,
    })
      .populate("product_color product_sizes.size_type product_categories")
      .lean();
    return results;
  };
  static createProduct = async ({
    parent_product_id,
    product_name,
    product_color,
    product_sizes,
    product_categories,
    product_images,
    product_gender,
    product_original_price,
    product_description,
  }) => {
    const result = await Products.create({
      parent_product_id,
      product_name,
      product_color,
      product_sizes,
      product_categories,
      product_images,
      product_gender,
      product_original_price,
      product_description,
    });
    return result;
  };
}
module.exports = ProductsService;
