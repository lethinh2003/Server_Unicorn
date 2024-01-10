const CartItems = require("../CartItems");

class CartItemRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await CartItems.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await CartItems.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await CartItems.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await CartItems.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await CartItems.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await CartItems.findOneAndDelete(query, options).select(select);
    return result;
  };
  static deleteMany = async ({ query = {}, options = {} }) => {
    const result = await CartItems.deleteMany(query, options);
    return result;
  };
  static createOne = async ({ data = {} }) => {
    const result = await CartItems.create(data);
    return result;
  };
}

module.exports = CartItemRepository;
