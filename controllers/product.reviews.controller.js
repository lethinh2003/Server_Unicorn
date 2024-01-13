"use strict";

const ProductReviewsService = require("../services/product.reviews.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
class ProductReviewsController {
  getAllReviews = catchAsync(async (req, res, next) => {
    const results = await ProductReviewsService.findAllReviews({});
    return new OkResponse({
      data: results,
    }).send(res);
  });
  getReviewsByProduct = catchAsync(async (req, res, next) => {
    const { productId, page = 1, itemsOfPage = 10, sort = "desc", rating = "all", type = "all" } = req.query;
    // get all reviews
    const results = await ProductReviewsService.getReviewsByProduct({
      productId,
      itemsOfPage,
      page,
      sort,
      rating,
      type,
    });
    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        page: page * 1,
        limit: itemsOfPage * 1,
        results: results.length,
      },
    }).send(res);
  });
  getRatingOverviewByProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.query;
    return new OkResponse({
      data: await ProductReviewsService.getRatingOverviewByProduct({ productId }),
      metadata: {
        ...req.query,
      },
    }).send(res);
  });
  createReview = catchAsync(async (req, res, next) => {
    const { productId, reviewStart, reviewImages, reviewComment, productSize } = req.body;
    const { _id: userId } = req.user;

    // Create new review
    const result = await ProductReviewsService.createReview({
      userId,
      productId,
      reviewStart,
      reviewImages,
      reviewComment,
      productSize,
    });
    return new CreatedResponse({
      data: result,
      message: PRODUCT_MESSAGES.CREATE_REVIEW_SUCCESS,
      metadata: {
        ...req.body,
        userId,
      },
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
