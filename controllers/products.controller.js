"use strict";

const ProductsService = require("../services/products.service");
const ProductReviewsService = require("../services/product.reviews.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { result } = require("lodash");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");
const _ = require("lodash"); // Import Lodash library
const { unSelectFields } = require("../utils/selectFields");
class ProductsController {
  getAllProducts = catchAsync(async (req, res, next) => {
    const results = await ProductsService.findAllProducts({});

    return new OkResponse({
      data: results,
    }).send(res);
  });
  getAllParentProducts = catchAsync(async (req, res, next) => {
    const { category = "all", gender, page, itemsOfPage, color = "all", size = "all" } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    let results = [];
    const listProducts = await ProductsService.findAllProductsByFilter({
      category,
      gender,
      skipItems,
      limitItems,
      color,
      size,
    });

    if (color === "all") {
      const productPromises = listProducts.map(async (product) => {
        const listChildProducts = await ProductsService.findAllChildProductsByParent({
          parentProductId: product._id,
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
    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        category,
        gender,
        color,
        size,

        results: results.length,
      },
    }).send(res);
  });
  getLatestProducts = catchAsync(async (req, res, next) => {
    const { page, itemsOfPage } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const listParentProducts = await ProductsService.findAllParentProducts({
      skipItems,
      limitItems,
    });
    let results = [];
    const productPromises = listParentProducts.map(async (product) => {
      const listChildProducts = await ProductsService.findAllChildProductsByParent({
        parentProductId: product._id,
      });
      return {
        ...unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: product }),
        child_products: listChildProducts.map((child) =>
          unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: child })
        ),
      };
    });
    results = await Promise.all(productPromises);

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        results: results.length,
      },
    }).send(res);
  });
  getSaleProducts = catchAsync(async (req, res, next) => {
    const { page, itemsOfPage } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const listParentProducts = await ProductsService.findAllParentSaleProducts({
      skipItems,
      limitItems,
    });
    let results = [];
    const productPromises = listParentProducts.map(async (product) => {
      const listChildProducts = await ProductsService.findAllChildProductsByParent({
        parentProductId: product._id,
      });
      return {
        ...unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: product }),
        child_products: listChildProducts.map((child) =>
          unSelectFields({ fields: ["product_categories", "product_sizes", "product_description"], object: child })
        ),
      };
    });
    results = await Promise.all(productPromises);

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        results: results.length,
      },
    }).send(res);
  });
  getSuggestProducts = catchAsync(async (req, res, next) => {
    const { productId, itemsOfPage } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    let results = [];
    // find Category of current product
    const findProduct = await ProductsService.findDetailProduct({
      productId,
    });
    const { product_categories, product_gender } = findProduct;
    const findSuggestProducts = await ProductsService.findAllParentSuggestProducts({
      category: product_categories,
      gender: product_gender,
      limitItems,
    });

    const productPromises = findSuggestProducts.map(async (product) => {
      const listChildProducts = await ProductsService.findAllChildProductsByParent({
        parentProductId: product._id,
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

    return new OkResponse({
      data: results,
      metadata: {
        limit: limitItems,
        results: results.length,
      },
    }).send(res);
  });
  getDetailProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const detailProduct = await ProductsService.findDetailProduct({
      productId,
    });
    if (!detailProduct) {
      return next(new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }

    // Find all color of product
    let relationProducts = [];
    if (!detailProduct.parent_product_id) {
      // if current product is parent -> find all child product
      const findChildProducts = await ProductsService.findAllChildProductsByParent({
        parentProductId: productId,
      });
      relationProducts = [...[detailProduct], ...findChildProducts];
    } else {
      // current product is child -> find parent product first, find all child product except current product
      const findParentProduct = await ProductsService.findDetailProduct({
        productId: detailProduct.parent_product_id,
      });
      const findChildProducts = await ProductsService.findAllChildProductsByParent({
        parentProductId: findParentProduct._id,
      });
      relationProducts = [...[findParentProduct], ...findChildProducts];
    }

    return new OkResponse({
      data: { ...detailProduct, relation_products: relationProducts },
    }).send(res);
  });
  createProduct = catchAsync(async (req, res, next) => {
    const {
      parentProductId,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
    } = req.body;

    if (
      !productName ||
      !productColor ||
      !productSizes ||
      !productCategories ||
      !productImages ||
      !productGender ||
      !productOriginalPrice ||
      !productDescription
    ) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await ProductsService.createProduct({
      parentProductId,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
    });

    return new CreatedResponse({
      message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    }).send(res);
  });
}

module.exports = new ProductsController();
