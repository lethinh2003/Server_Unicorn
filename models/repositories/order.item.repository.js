const OrderItems = require("../OrderItems");

class OrderItemRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await OrderItems.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await OrderItems.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await OrderItems.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await OrderItems.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await OrderItems.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await OrderItems.findOneAndDelete(query, options).select(select);
    return result;
  };
  static findManyAndDelete = async ({ query = {}, options = {} }) => {
    const result = await OrderItems.deleteMany(query, options);
    return result;
  };

  static createOne = async ({ data = {}, options = {} }) => {
    const result = await OrderItems.create([data], options);
    return result[0];
  };
}

module.exports = OrderItemRepository;
