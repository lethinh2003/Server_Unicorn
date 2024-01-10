const Carts = require("../Carts");

class CartRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await Carts.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await Carts.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await Carts.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await Carts.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Carts.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Carts.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await Carts.create(data);
    return result;
  };
}

module.exports = CartRepository;
