const ProductReviews = require("../ProductReviews");

class ProductReviewRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await ProductReviews.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await ProductReviews.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await ProductReviews.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await ProductReviews.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await ProductReviews.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await ProductReviews.findOneAndDelete(query, options).select(select);
    return result;
  };
  static findManyAndDelete = async ({ query = {}, options = {} }) => {
    const result = await ProductReviews.deleteMany(query, options);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await ProductReviews.create(data);
    return result;
  };
}

module.exports = ProductReviewRepository;
