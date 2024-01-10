const FavoriteProducts = require("../FavoriteProducts");

class FavoriteProductRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await FavoriteProducts.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await FavoriteProducts.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await FavoriteProducts.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await FavoriteProducts.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await FavoriteProducts.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await FavoriteProducts.findOneAndDelete(query, options).select(select);
    return result;
  };
  static deleteMany = async ({ query = {}, options = {} }) => {
    const result = await FavoriteProducts.deleteMany(query, options);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await FavoriteProducts.create(data);
    return result;
  };
}

module.exports = FavoriteProductRepository;
