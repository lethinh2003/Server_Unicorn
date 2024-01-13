"use strict";

const ProductRepository = require("../models/repositories/product.repository");
const _ = require("lodash"); // Import Lodash library
const { unSelectFields, selectFields } = require("../utils/selectFields");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { getChildFromParentListProduct } = require("../utils/product");
const PRODUCT_SELECTION = {
  list: "-__v -product_description -product_sizes -product_categories",
  detail: "-__v -product_sizes._id -product_description._id",
  detail_relations: "-product_categories -product_sizes -product_description -__v",
};
const PRODUCT_POPULATION = {
  list: [
    {
      path: "product_color",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_categories",
      select: "-_id product_category_keyword product_category_name",
    },
    {
      path: "product_sale_event",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_sizes.size_type",
      select: "-_id -status",
    },
  ],
  detail: [
    {
      path: "product_color",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_categories",
      select: "_id product_category_keyword product_category_name",
    },
    {
      path: "product_sale_event",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_sizes.size_type",
      select: "-status ",
    },
  ],
  detail_relations: [
    {
      path: "product_color",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_categories",
      select: "_id product_category_keyword product_category_name",
    },
    {
      path: "product_sale_event",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_sizes.size_type",
      select: "-status",
    },
  ],
};
class ProductsService {
  static searchProducts = async ({ query = "" }) => {
    const results = await ProductRepository.findAll({
      query: {
        status: true,
        $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
        $text: { $search: query },
      },
      options: { score: { $meta: "textScore" } },
      sort: { score: { $meta: "textScore" } },
      select: "-product_categories -product_images -product_sizes -product_description -__v",
    });
    return results;
  };

  static getAllParentProducts = async ({ itemsOfPage, page, category, gender, color, size }) => {
    const limitItems = itemsOfPage * 1 || 10;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    let results = [];

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

    results = await getChildFromParentListProduct({
      category,
      gender,
      color,
      size,
      limitItems,
      skipItems,
      sort: "-createdAt",
    });
    return results;
  };
  static getLatestProducts = async ({ itemsOfPage, page }) => {
    const limitItems = itemsOfPage * 1 || 10;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    let query = {
      status: true,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
    };
    const listProducts = await ProductRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      sort: "-createdAt",
      select: PRODUCT_SELECTION.list,
      populate: PRODUCT_POPULATION.list,
    });

    return listProducts;
  };
  static getSaleProducts = async ({ itemsOfPage, page }) => {
    const limitItems = itemsOfPage * 1 || 10;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    let query = {
      status: true,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
      product_sale_event: { $ne: null },
    };
    const listProducts = await ProductRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      sort: "-createdAt",
      select: PRODUCT_SELECTION.list,
      populate: PRODUCT_POPULATION.list,
    });

    return listProducts;
  };
  static getSuggestProducts = async ({ productId, itemsOfPage }) => {
    const limitItems = itemsOfPage * 1 || 10;

    let results = [];
    // find Category of current product
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
      select: "product_categories product_gender",
    });
    if (!findProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    const { product_categories, product_gender } = findProduct;

    // Random items
    const countDocuments = await ProductRepository.countDocuments({
      query: {
        product_categories,
        product_gender,
        $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
        status: true,
      },
    });

    const random = Math.floor(Math.random() * countDocuments);

    // Get Random Products

    results = await getChildFromParentListProduct({
      category: product_categories,
      gender: product_gender,
      color: "all",
      size: "all",
      limitItems,
      skipItems: random,
      sort: "-createdAt",
    });

    // Remove Product if duplicate
    results = results.filter((item) => item._id.toString() !== productId);

    return results;
  };
  static getDetailProduct = async ({ productId }) => {
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    const detailProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
      select: PRODUCT_SELECTION.detail,
      populate: PRODUCT_POPULATION.detail,
    });
    if (!detailProduct) {
      throw new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }

    // Find all color of product
    let relationProducts = [];
    if (!detailProduct.parent_product_id) {
      // if current product is parent -> find all child product
      const findParentProduct = await ProductRepository.findOne({
        query: {
          _id: detailProduct._id,
          status: true,
        },
        select: PRODUCT_SELECTION.detail_relations,
        populate: PRODUCT_POPULATION.detail_relations,
      });

      const findChildProducts = await ProductRepository.findAll({
        query: {
          parent_product_id: productId,
          status: true,
        },
        select: PRODUCT_SELECTION.detail_relations,
        populate: PRODUCT_POPULATION.detail_relations,
      });

      relationProducts = [...[findParentProduct], ...findChildProducts];
    } else {
      // current product is child -> find parent product first, find all child product except current product
      const findParentProduct = await ProductRepository.findOne({
        query: {
          _id: detailProduct.parent_product_id,
          status: true,
        },
        select: PRODUCT_SELECTION.detail_relations,
        populate: PRODUCT_POPULATION.detail_relations,
      });

      const findChildProducts = await ProductRepository.findAll({
        query: {
          parent_product_id: findParentProduct._id,
          status: true,
        },
        select: PRODUCT_SELECTION.detail_relations,
        populate: PRODUCT_POPULATION.detail_relations,
      });
      relationProducts = [...[findParentProduct], ...findChildProducts];
    }
    return { ...detailProduct, relation_products: relationProducts };
  };

  ///////
}
module.exports = ProductsService;
