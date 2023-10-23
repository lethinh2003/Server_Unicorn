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
    const { category, gender, page, itemsOfPage } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const listParentProducts = await ProductsService.findAllParentProducts({
      category,
      gender,
      skipItems,
      limitItems,
    });
    const results = [];
    for (const product of listParentProducts) {
      const listChildProducts = await ProductsService.findAllChildProductsByParent({
        parentProductId: product._id,
      });
      results.push({ ...product, child_products: listChildProducts });
    }

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        category,
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
    const childProduct = await ProductsService.findAllChildProductsByParent({
      parentProductId: productId,
    });

    return new OkResponse({
      data: { ...detailProduct, child_products: childProduct },
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
