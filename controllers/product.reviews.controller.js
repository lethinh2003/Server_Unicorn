"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const ProductReviewsService = require("../services/product.reviews.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");

class ProductReviewsController {
  getAllReviews = catchAsync(async (req, res, next) => {
    const results = await ProductReviewsService.findAllReviews({});
    return new OkResponse({
      data: results,
    }).send(res);
  });
  getReviewsByProduct = catchAsync(async (req, res, next) => {
    const { productId, page, itemsOfPage } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await ProductReviewsService.findReviewsByProduct({
      productId,
      skipItems,
      limitItems,
    });
    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        productId,
        results: results.length,
      },
    }).send(res);
  });
  createReview = catchAsync(async (req, res, next) => {
    const { parentProductId, productId, reviewStart, reviewImages, reviewComment } = req.body;
    const { _id: userId } = req.user;
    if (!productId || !reviewStart || !reviewComment) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
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
      parentProductId,
      productId,
      reviewStart,
      reviewImages,
      reviewComment,
    });
    return new CreatedResponse({
      data: result,
    }).send(res);
  });
}

module.exports = new ProductReviewsController();
