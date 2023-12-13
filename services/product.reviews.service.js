"use strict";
const ProductReviews = require("../models/ProductReviews");

class ProductReviewsService {
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await ProductReviews.deleteMany({
      user: userId,
    }).session(options?.session || null);
    return data;
  };
  static findAllReviews = async ({}) => {
    const results = await ProductReviews.find({}).lean();
    return results;
  };
  static findReviewsByProduct = async ({ parentProductId, productId, skipItems, limitItems, sort, rating, type }) => {
    let results = [];
    let query = {
      review_star: rating === "all" ? { $gt: 0 } : { $eq: rating },
      $expr: type === "all" ? { $gte: [{ $size: "$review_images" }, 0] } : { $gt: [{ $size: "$review_images" }, 0] },
    };

    // Is parent product
    if (!parentProductId) {
      results = await ProductReviews.find({
        ...query,
        $or: [{ product_id: productId }, { parent_product_id: productId }],
      })
        .sort({
          createdAt: sort,
        })
        .skip(skipItems)
        .limit(limitItems)
        .populate([
          {
            path: "product_size",
          },
          {
            path: "user",
            select: "name",
          },
          {
            path: "product_id",
            populate: {
              path: "product_color",
            },
          },
          {
            path: "parent_product_id",
          },
        ])
        .lean();
    } else {
      // is child product
      results = await ProductReviews.find({
        ...query,
        $or: [{ product_id: productId }, { product_id: parentProductId }, { parent_product_id: parentProductId }],
      })
        .sort({
          createdAt: sort,
        })
        .skip(skipItems)
        .limit(limitItems)
        .populate([
          {
            path: "product_size",
          },
          {
            path: "user",
            select: "name",
          },
          {
            path: "product_id",

            populate: {
              path: "product_color",
            },
          },
          {
            path: "parent_product_id",
          },
        ])
        .lean();
    }
    return results;
  };

  static findAllReviewsByProduct = async ({ parentProductId, productId }) => {
    let results = [];
    if (!parentProductId) {
      // is parent product
      results = await ProductReviews.find({
        $or: [{ product_id: productId }, { parent_product_id: productId }],
      }).lean();
    } else {
      // is child product
      results = await ProductReviews.find({
        $or: [{ product_id: productId }, { product_id: parentProductId }, { parent_product_id: parentProductId }],
      }).lean();
    }
    return results;
  };
  static findUserReviewByProduct = async ({ productId, userId }) => {
    const result = await ProductReviews.findOne({
      user: userId,
      product_id: productId,
    }).lean();
    return result;
  };
  static createReview = async ({ parentProductId = undefined, productId, reviewStart, reviewImages = [], reviewComment, userId, productSize }) => {
    const results = await ProductReviews.create({
      user: userId,
      parent_product_id: parentProductId,
      product_id: productId,
      review_star: reviewStart,
      review_images: reviewImages,
      review_comment: reviewComment,
      product_size: productSize
    });
    return results;
  };
}
module.exports = ProductReviewsService;
