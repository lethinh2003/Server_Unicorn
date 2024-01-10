const ProductCategories = require("../ProductCategories");

class ProductCategoriesRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await ProductCategories.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await ProductCategories.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await ProductCategories.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await ProductCategories.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await ProductCategories.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await ProductCategories.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await ProductCategories.create(data);
    return result;
  };
}

module.exports = ProductCategoriesRepository;
