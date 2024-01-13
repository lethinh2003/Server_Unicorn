const Products = require("../Products");

class ProductRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await Products.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await Products.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, options = {}, select = "", populate, sort }) => {
    const result = await Products.find(query, options).select(select).populate(populate).sort(sort).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await Products.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Products.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Products.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await Products.create(data);
    return result;
  };
}

module.exports = ProductRepository;
