"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const ProductReviewsService = require("../services/product.reviews.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");
const ProductsService = require("../services/products.service");
const _ = require("lodash");
const { selectFields } = require("../utils/selectFields");
class ProductReviewsController {
  getAllReviews = catchAsync(async (req, res, next) => {
    const results = await ProductReviewsService.findAllReviews({});
    return new OkResponse({
      data: results,
    }).send(res);
  });
  getReviewsByProduct = catchAsync(async (req, res, next) => {
    const { productId, page, itemsOfPage, sort = "desc", rating = "all", type = "all" } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    if (!productId) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const findProduct = await ProductsService.findById({
      productId,
    });
    // Check product is exists
    if (!findProduct) {
      return next(new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }

    // get all reviews
    const results = await ProductReviewsService.findReviewsByProduct({
      parentProductId: findProduct.parent_product_id,
      productId,
      skipItems,
      limitItems,
      sort,
      rating,
      type,
    });
    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        sort,
        rating,
        type,
        productId,
        results: results.length,
      },
    }).send(res);
  });
  getRatingOverviewByProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.query;
    if (!productId) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const findProduct = await ProductsService.findById({
      productId,
    });
    // Check product is exists
    if (!findProduct) {
      return next(new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }
    // get all reviews
    const results = await ProductReviewsService.findAllReviewsByProduct({
      parentProductId: findProduct.parent_product_id,
      productId,
    });
    const groupByRating = _.groupBy(results, (item) => item.review_star);
    let ratingOverview = {
      average: parseFloat((_.sumBy(results, (item) => item.review_star) / results.length).toFixed(1)) || 0, //rouding number: 3.6667 -> 3.7 ,
      count_1: groupByRating?.["1"]?.length || 0,
      count_2: groupByRating?.["2"]?.length || 0,
      count_3: groupByRating?.["3"]?.length || 0,
      count_4: groupByRating?.["4"]?.length || 0,
      count_5: groupByRating?.["5"]?.length || 0,
      count_reviews: results.length,
    };
    return new OkResponse({
      data: ratingOverview,
      metadata: {
        productId,
        results: results.length,
      },
    }).send(res);
  });
  createReview = catchAsync(async (req, res, next) => {
    const { productId, reviewStart, reviewImages, reviewComment, productSize } = req.body;
    const { _id: userId } = req.user;
    if (!productId || !reviewStart || !reviewComment || !productSize) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    if (reviewStart * 1 <= 0 || reviewStart * 1 > 5) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }

    // Check product is valid
    const findProduct = await ProductsService.findById({
      productId,
    });

    if (!findProduct) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }

    // Check user reviewed yet?
    const findUserReview = await ProductReviewsService.findUserReviewByProduct({
      productId,
      userId,
    });
    if (findUserReview) {
      return next(new BadRequestError(PRODUCT_MESSAGES.REVIEW_IS_EXISTS));
    }
    // Create new review
    const result = await ProductReviewsService.createReview({
      userId,
      parentProductId: findProduct?.parent_product_id,
      productId,
      reviewStart,
      reviewImages,
      reviewComment,
      productSize
    });
    return new CreatedResponse({
      data: result,
      message: PRODUCT_MESSAGES.CREATE_REVIEW_SUCCESS,
    }).send(res);
  });
  uploadImages = catchAsync(async (req, res, next) => {
    var imageUrlList = [];

    for (var i = 0; i < req.files.length; i++) {
      imageUrlList.push({ fileName: req.files[i].originalname, fileUrl: req.files[i].path, typeFile: req.files[i].mimetype });
    }
    return new OkResponse({
      data: imageUrlList,
    }).send(res);
  });
}

module.exports = new ProductReviewsController();
