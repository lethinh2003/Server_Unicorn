"use strict";
const Products = require("../models/Products");
const mongoose = require("mongoose");
class ProductsService {
  static findAllProducts = async ({}) => {
    const results = await Products.find({
      status: true,
    }).lean();
    return results;
  };
  static findById = async ({ productId }) => {
    const result = await Products.findOne({
      _id: productId,
      status: true,
    }).lean();
    return result;
  };
  static findDetailProduct = async ({ productId }) => {
    const result = await Products.findOne({
      _id: productId,
      status: true,
    })
      .populate("product_color product_sizes.size_type product_categories")
      .lean();
    return result;
  };
  static checkAvailableProduct = async ({ productId, productSize, productQuantities }) => {
    const result = await Products.findOne({
      _id: productId,
    }).lean();
    if (!result) {
      return false;
    }
    const findProductSize = result?.product_sizes?.filter((item) => item.size_type.toString() === productSize.toString())[0];
    if (!findProductSize) {
      return false;
    }
    if (findProductSize.size_quantities < productQuantities) {
      return false;
    }

    return true;
  };
  static findAllParentProducts = async ({ category, gender, skipItems, limitItems, color, size }) => {
    let query = {
      status: true,
      product_gender: gender,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
    };
    if (category !== "all") {
      query.product_categories = category;
    }
    if (color !== "all") {
      query.product_color = color;
    }
    if (size !== "all") {
      query.product_sizes = { $elemMatch: { size_type: size } };
    }

    const results = await Products.find(query)
      .populate("product_color product_sizes.size_type product_categories")
      .limit(limitItems)
      .skip(skipItems)
      .lean();
    return results;
  };
  static findAllParentSuggestProducts = async ({ category, gender, limitItems }) => {
    let query = {
      status: true,
      product_gender: gender,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
      product_categories: category,
    };
    const countDocuments = await Products.countDocuments(query);

    const random = Math.floor(Math.random() * countDocuments);
    const results = await Products.find(query)
      .populate("product_color product_sizes.size_type product_categories")
      .limit(limitItems)
      .skip(random)
      .lean();
    return results;
  };
  static findAllProductsByFilter = async ({ category, gender, skipItems, limitItems, color, size }) => {
    let query = {
      status: true,
      product_gender: gender,
    };
    if (category !== "all") {
      query.product_categories = category;
    }
    if (color !== "all") {
      query.product_color = color;
    } else {
      query.$or = [{ parent_product_id: null }, { parent_product_id: undefined }];
    }
    if (size !== "all") {
      query.product_sizes = { $elemMatch: { size_type: size } };
    }

    const results = await Products.find(query)
      .populate("product_color product_sizes.size_type product_categories")
      .limit(limitItems)
      .skip(skipItems)
      .lean();
    return results;
  };
  static findAllChildProductsByParent = async ({ parentProductId }) => {
    const results = await Products.find({
      parent_product_id: parentProductId,
      status: true,
    })
      .populate("product_color product_sizes.size_type product_categories")
      .lean();
    return results;
  };
  static findAllChildProductsByParentExceptCurrent = async ({ parentProductId, currentProductId }) => {
    const results = await Products.find({
      _id: { $ne: currentProductId },
      parent_product_id: parentProductId,
      status: true,
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
