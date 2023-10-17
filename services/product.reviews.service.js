"use strict";
const ProductReviews = require("../models/ProductReviews");

class ProductReviewsService {
  static findAllReviews = async ({}) => {
    const results = await ProductReviews.find({}).lean();
    return results;
  };
  static findReviewsByProduct = async ({ parentProductId, productId, skipItems, limitItems }) => {
    let results = [];
    // Is parent product
    if (!parentProductId) {
      results = await ProductReviews.find({
        $or: [{ product_id: productId }, { parent_product_id: productId }],
      })
        .skip(skipItems)
        .limit(limitItems)
        .lean();
    } else {
      // is child product
      results = await ProductReviews.find({
        $or: [{ product_id: productId }, { product_id: parentProductId }, { parent_product_id: parentProductId }],
      })
        .skip(skipItems)
        .limit(limitItems)
        .lean();
    }
    return results;
  };

  static findAllReviewsByProduct = async ({ productId }) => {
    const results = await ProductReviews.find({
      product_id: productId,
    }).lean();
    return results;
  };
  static findUserReviewByProduct = async ({ productId, userId }) => {
    const result = await ProductReviews.findOne({
      user: userId,
      product_id: productId,
    }).lean();
    return result;
  };
  static createReview = async ({ parentProductId = undefined, productId, reviewStart, reviewImages = [], reviewComment, userId }) => {
    const results = await ProductReviews.create({
      user: userId,
      parent_product_id: parentProductId,
      product_id: productId,
      review_start: reviewStart,
      review_images: reviewImages,
      review_comment: reviewComment,
    });
    return results;
  };
}
module.exports = ProductReviewsService;
