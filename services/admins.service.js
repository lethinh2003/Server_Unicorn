"use strict";

const CartItems = require("../models/CartItems");
const FavoriteProducts = require("../models/FavoriteProducts");
const Orders = require("../models/Orders");
const ProductCategories = require("../models/ProductCategories");
const ProductReviews = require("../models/ProductReviews");
const Products = require("../models/Products");
const Users = require("../models/Users");

class AdminsService {
  static findUserById = async ({ userId }) => {
    const user = await Users.findOne({ _id: userId }).lean();
    return user;
  };
  static findUsers = async ({ limitItems, skipItems }) => {
    const users = await Users.find({}).skip(skipItems).limit(limitItems).lean();
    return users;
  };
  static findCategories = async ({ limitItems, skipItems }) => {
    const users = await ProductCategories.find({}).skip(skipItems).limit(limitItems).lean();
    return users;
  };
  static findAllUsers = async () => {
    const users = await Users.find({}).lean();
    return users;
  };
  static findOrders = async ({ limitItems, skipItems }) => {
    const users = await Orders.find({}).skip(skipItems).limit(limitItems).lean().populate("user").sort("-createdAt");
    return users;
  };
  static findDetailUserById = async ({ userId }) => {
    const user = await Users.findOne({ _id: userId }).lean();
    return user;
  };
  static createUser = async ({ email, password, birthday, gender, name, phone_number, status, role }) => {
    const user = await Users.create({
      email,
      password,
      birthday,
      gender,
      name,
      phone_number,
      status,
      role,
    });
    return user;
  };
  static updateUser = async ({ userId, email, password, birthday, gender, name, phone_number, status, role }) => {
    const user = await Users.findOneAndUpdate(
      { _id: userId, email: email },
      {
        password,
        birthday,
        gender,
        name,
        phone_number,
        status,
        role,
      },
      {
        runValidators: true,
      }
    );
    return user;
  };
  static countAllUsers = async () => {
    const count = await Users.countDocuments({});
    return count;
  };
  static countAllProductCategories = async () => {
    const count = await ProductCategories.countDocuments({});
    return count;
  };
  static countAllProducts = async () => {
    const count = await Products.countDocuments({});
    return count;
  };
  static countAllOrders = async () => {
    const count = await Orders.countDocuments({});
    return count;
  };

  static findAllProducts = async ({ skipItems, limitItems }) => {
    const results = await Products.find({})
      .populate("product_color product_sizes.size_type product_categories product_sale_event")
      .limit(limitItems)
      .skip(skipItems)
      .sort("-createdAt")
      .lean();
    return results;
  };

  static findDetailProduct = async ({ productId }) => {
    const result = await Products.findOne({
      _id: productId,
    })
      .populate("product_color product_sizes.size_type product_categories product_sale_event")
      .lean();
    return result;
  };
  static findDetailProductCategory = async ({ categoryId }) => {
    const result = await ProductCategories.findOne({
      _id: categoryId,
    }).lean();
    return result;
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
    productSaleEvent,
    productStatus,
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
      product_sale_event: productSaleEvent,
      status: productStatus,
    });
    return result;
  };
  static updateProduct = async ({
    productId,
    parentProductId,
    productName,
    productColor,
    productSizes,
    productCategories,
    productImages,
    productGender,
    productOriginalPrice,
    productDescription,
    productSaleEvent,
    productStatus,
  }) => {
    const result = await Products.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        parent_product_id: parentProductId,
        product_name: productName,
        product_color: productColor,
        product_sizes: productSizes,
        product_categories: productCategories,
        product_images: productImages,
        product_gender: productGender,
        product_original_price: productOriginalPrice,
        product_description: productDescription,
        product_sale_event: productSaleEvent,
        status: productStatus,
      }
    );
    return result;
  };
  static updateCategory = async ({
    categoryId,
    parentCategory,
    categoryImage,
    categoryGender,
    categoryKeyword,
    categoryName,
    categoryStatus,
  }) => {
    const result = await ProductCategories.findOneAndUpdate(
      {
        _id: categoryId,
      },
      {
        product_category_parent_id: parentCategory,
        product_category_image: categoryImage,
        product_category_gender: categoryGender,
        product_category_keyword: categoryKeyword,
        product_category_name: categoryName,
        status: categoryStatus,
      }
    );
    return result;
  };
  static deleteProduct = async ({ productId, options = {} }) => {
    const result = await Products.findOneAndDelete(
      {
        _id: productId,
      },
      options
    );
    return result;
  };

  static deleteFavoriteProductByProductId = async ({ productId, options = {} }) => {
    const result = await FavoriteProducts.deleteMany({
      product_id: productId,
    }).session(options?.session || null);
    return result;
  };

  static deleteCartItemByProductId = async ({ productId, options = {} }) => {
    const result = await CartItems.deleteMany({
      "data.product": productId,
    }).session(options?.session || null);

    return result;
  };
  static deleteProductReviewByProductId = async ({ productId, options = {} }) => {
    const result = await ProductReviews.deleteMany({
      $or: [{ product_id: productId }, { parent_product_id: productId }],
    }).session(options?.session || null);

    return result;
  };
}
module.exports = AdminsService;
