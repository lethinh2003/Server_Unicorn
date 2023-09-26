"use strict";
const Products = require("../models/Products");
class ProductsService {
  static findAllProducts = async ({}) => {
    const results = await Products.find({}).lean();
    return results;
  };
  static findDetailProduct = async ({ productId }) => {
    const result = await Products.findOne({
      _id: productId,
    })
      .populate("product_color product_sizes.size_type product_categories")
      .lean();
    return result;
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
  static findAllChildProductsByParent = async ({ parentProductId }) => {
    const results = await Products.find({
      parent_product_id: parentProductId,
    })
      .populate("product_color product_sizes.size_type product_categories")
      .lean();
    return results;
  };
  static createProduct = async ({
    parentProductId,
    productName,
    productColor,
    productSizes,
    productCategories,
    productImages,
    productGender,
    productOriginalPrice,
    productDescription,
  }) => {
    const result = await Products.create({
      parent_product_id: parentProductId,
      product_name: productName,
      product_color: productColor,
      product_sizes: productSizes,
      product_categories: productCategories,
      product_images: productImages,
      product_gender: productGender,
      product_original_price: productOriginalPrice,
      product_description: productDescription,
    });
    return result;
  };
}
module.exports = ProductsService;
