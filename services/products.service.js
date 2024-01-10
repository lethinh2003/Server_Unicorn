"use strict";

const ProductRepository = require("../models/repositories/product.repository");
const _ = require("lodash"); // Import Lodash library
const { unSelectFields } = require("../utils/selectFields");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");

class ProductsService {
  static searchProducts = async ({ query }) => {
    const results = await ProductRepository.findAll({
      query: {
        status: true,
        $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
        $text: { $search: query },
      },
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
    const listProducts = await ProductRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      sort: "-createdAt",
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });

    if (color === "all") {
      const productPromises = listProducts.map(async (product) => {
        const listChildProducts = await ProductRepository.findAll({
          query: {
            parent_product_id: product._id,
            status: true,
          },
          populate: "product_color product_sizes.size_type product_categories product_sale_event",
        });
        return {
          ...unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: product }),
          child_products: listChildProducts.map((child) =>
            unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: child })
          ),
        };
      });

      results = await Promise.all(productPromises);
    } else {
      results = listProducts;
    }
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
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
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
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
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
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });
    const { product_categories, product_gender } = findProduct;

    let query = {
      status: true,
      product_gender,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
      product_categories,
    };

    const countDocuments = await ProductRepository.countDocuments({ query });

    const random = Math.floor(Math.random() * countDocuments);

    const findSuggestProducts = await ProductRepository.find({
      query,
      limit: limitItems,
      skip: random,
      sort: "-createdAt",
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });

    const productPromises = findSuggestProducts.map(async (product) => {
      const listChildProducts = await ProductRepository.findAll({
        query: {
          parent_product_id: product._id,
          status: true,
        },
        populate: "product_color product_sizes.size_type product_categories product_sale_event",
      });
      return {
        ...unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: product }),
        child_products: listChildProducts.map((child) =>
          unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: child })
        ),
      };
    });
    results = await Promise.all(productPromises);
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
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });
    if (!detailProduct) {
      throw new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }

    // Find all color of product
    let relationProducts = [];
    if (!detailProduct.parent_product_id) {
      // if current product is parent -> find all child product
      const findChildProducts = await ProductRepository.findAll({
        query: {
          parent_product_id: productId,
          status: true,
        },
        populate: "product_color product_sizes.size_type product_categories product_sale_event",
      });

      relationProducts = [...[detailProduct], ...findChildProducts];
    } else {
      // current product is child -> find parent product first, find all child product except current product
      const findParentProduct = await ProductRepository.findOne({
        query: {
          _id: detailProduct.parent_product_id,
          status: true,
        },
        populate: "product_color product_sizes.size_type product_categories product_sale_event",
      });

      const findChildProducts = await ProductRepository.findAll({
        query: {
          parent_product_id: findParentProduct._id,
          status: true,
        },
        populate: "product_color product_sizes.size_type product_categories product_sale_event",
      });
      relationProducts = [...[findParentProduct], ...findChildProducts];
    }
    return { ...detailProduct, relation_products: relationProducts };
  };

  ///////
}
module.exports = ProductsService;
