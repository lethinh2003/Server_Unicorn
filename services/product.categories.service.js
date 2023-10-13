"use strict";
const { PRODUCT_GENDERS } = require("../configs/config.product.genders");
const ProductCategories = require("../models/ProductCategories");

class ProductCategoriesService {
  static findAllCategories = async ({}) => {
    const results = await ProductCategories.find({}).lean();
    return results;
  };
  static findAllParentCategories = async ({ gender }) => {
    const results = await ProductCategories.find({
      product_category_parent_id: undefined,
      $or: [
        { product_category_gender: gender },
        {
          product_category_gender: PRODUCT_GENDERS.UNISEX,
        },
      ],
    }).lean();
    return results;
  };
  static findChildCategories = async ({ parentCategoryId, gender = PRODUCT_GENDERS.UNISEX }) => {
    let results = [];
    if (gender != PRODUCT_GENDERS.UNISEX) {
      results = await ProductCategories.find({
        product_category_parent_id: parentCategoryId,
        $or: [
          { product_category_gender: gender },
          {
            product_category_gender: PRODUCT_GENDERS.UNISEX,
          },
        ],
      }).lean();
    } else {
      results = await ProductCategories.find({
        product_category_parent_id: parentCategoryId,
        product_category_gender: PRODUCT_GENDERS.UNISEX,
      }).lean();
    }

    return results;
  };
  static createCategory = async ({ parentCategoryId, name, keyword, gender }) => {
    const result = await ProductCategories.create({
      product_category_parent_id: parentCategoryId,
      product_category_name: name,
      product_category_keyword: keyword,
      product_category_gender: gender,
    });
    return result;
  };
}
module.exports = ProductCategoriesService;
