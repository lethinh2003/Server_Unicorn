"use strict";
const { PRODUCT_GENDERS } = require("../configs/config.product.genders");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const ProductCategoriesRepository = require("../models/repositories/product.category.repository");
const { UnauthorizedError } = require("../utils/app_error");

class ProductCategoriesService {
  static getAllParentCategoriesByGender = async ({ gender }) => {
    let checkGenderExists = Object.values(PRODUCT_GENDERS).includes(gender);
    if (!checkGenderExists) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    // Find parent category
    const listParentCategories = await ProductCategoriesRepository.findAll({
      query: {
        product_category_parent_id: undefined,
        $or: [
          { product_category_gender: gender },
          {
            product_category_gender: PRODUCT_GENDERS.UNISEX,
          },
        ],
      },
    });
    return listParentCategories;
  };
  static getAllCategoriesByGender = async ({ gender }) => {
    let checkGenderExists = Object.values(PRODUCT_GENDERS).includes(gender);
    if (!checkGenderExists) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    // Find parent category
    const listParentCategories = await ProductCategoriesRepository.findAll({
      query: {
        product_category_parent_id: undefined,
        $or: [
          { product_category_gender: gender },
          {
            product_category_gender: PRODUCT_GENDERS.UNISEX,
          },
        ],
      },
    });
    const results = [];
    for (const itemParentCategory of listParentCategories) {
      // Find child categories from parent category

      let query = { product_category_parent_id: itemParentCategory._id };
      if (gender != PRODUCT_GENDERS.UNISEX) {
        query = {
          ...query,
          $or: [
            { product_category_gender: gender },
            {
              product_category_gender: PRODUCT_GENDERS.UNISEX,
            },
          ],
        };
      } else {
        query = {
          ...query,
          product_category_gender: PRODUCT_GENDERS.UNISEX,
        };
      }
      const listChildCategories = await ProductCategoriesRepository.findAll({ query });

      results.push({ ...itemParentCategory, child_categories: listChildCategories });
    }
    return results;
  };

  static getChildCategories = async ({ parentId, gender = PRODUCT_GENDERS.UNISEX }) => {
    let query = { product_category_parent_id: parentId };

    if (gender != PRODUCT_GENDERS.UNISEX) {
      query = {
        ...query,
        $or: [
          { product_category_gender: gender },
          {
            product_category_gender: PRODUCT_GENDERS.UNISEX,
          },
        ],
      };
    } else {
      query = {
        ...query,
        product_category_gender: PRODUCT_GENDERS.UNISEX,
      };
    }
    const listChildCategories = await ProductCategoriesRepository.findAll({ query });

    return listChildCategories;
  };

  ////
}
module.exports = ProductCategoriesService;
