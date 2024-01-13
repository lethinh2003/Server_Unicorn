"use strict";
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const ProductRepository = require("../models/repositories/product.repository");
const ProductReviewRepository = require("../models/repositories/product.review.repository");
const _ = require("lodash");

class ProductReviewsService {
  static getReviewsByProduct = async ({ itemsOfPage = 10, page = 1, productId, sort = "desc", rating = "all", type = "all" }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
    });
    // Check product is exists
    if (!findProduct) {
      throw new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }

    // get all reviews

    const parentProductId = findProduct.parent_product_id;
    let query = {
      status: true,
      review_star: rating === "all" ? { $gt: 0 } : { $eq: rating },
      $expr: type === "all" ? { $gte: [{ $size: "$review_images" }, 0] } : { $gt: [{ $size: "$review_images" }, 0] },
    };
    // Is parent product
    if (!parentProductId) {
      query = { ...query, $or: [{ product_id: productId }, { parent_product_id: productId }] };
    } else {
      // Is child product
      query = { ...query, $or: [{ product_id: productId }, { product_id: parentProductId }, { parent_product_id: parentProductId }] };
    }
    const results = await ProductReviewRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      sort: {
        createdAt: sort,
      },
      select: "-__v",
      populate: [
        {
          path: "product_size",
          select: "-_id -status",
        },
        {
          path: "user",
          select: "name",
        },
        {
          path: "product_id",
          select: "product_color product_name",
          populate: {
            path: "product_color",
            select: "-_id -status -createdAt -updatedAt -__v",
          },
        },
        {
          path: "parent_product_id",
          populate: {
            path: "product_color",
            select: "-_id -status -createdAt -updatedAt -__v",
          },
          select: "product_color product_name",
        },
      ],
    });

    return results;
  };
  static getRatingOverviewByProduct = async ({ productId }) => {
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
    });
    // Check product is exists
    if (!findProduct) {
      throw new NotFoundError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    // get all reviews
    let query = {};
    const parentProductId = findProduct.parent_product_id;
    if (!parentProductId) {
      query = {
        status: true,
        $or: [{ product_id: productId }, { parent_product_id: productId }],
      };
    } else {
      query = {
        status: true,
        $or: [{ product_id: productId }, { product_id: parentProductId }, { parent_product_id: parentProductId }],
      };
    }

    const results = await ProductReviewRepository.findAll({
      query,
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
    return ratingOverview;
  };
  static createReview = async ({ productId, reviewStart, reviewImages, reviewComment, productSize, userId }) => {
    if (!productId || !reviewStart || !reviewComment || !productSize) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    if (reviewStart * 1 <= 0 || reviewStart * 1 > 5) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }

    // Check product is valid
    const findProduct = await ProductRepository.findOne({
      query: {
        _id: productId,
        status: true,
      },
    });

    if (!findProduct) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }

    // Check user reviewed yet?
    const findUserReview = await ProductReviewRepository.findOne({
      query: {
        status: true,
        user: userId,
        product_id: productId,
        product_size: productSize,
      },
    });
    if (findUserReview) {
      throw new BadRequestError(PRODUCT_MESSAGES.REVIEW_IS_EXISTS);
    }
    // Create new review
    const result = await ProductReviewRepository.createOne({
      data: {
        parent_product_id: findProduct?.parent_product_id,
        product_id: productId,
        review_star: reviewStart,
        review_images: reviewImages,
        review_comment: reviewComment,
        product_size: productSize,
        user: userId,
      },
    });

    return result;
  };

  /////
}
module.exports = ProductReviewsService;
