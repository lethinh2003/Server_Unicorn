const Orders = require("../Orders");

class OrderRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await Orders.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };
  static aggregate = async ({ filter, group, sort }) => {
    const results = await Orders.aggregate([
      {
        $match: filter,
      },
      {
        $group: group,
      },
      {
        $sort: sort,
      },
    ]);

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await Orders.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await Orders.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await Orders.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Orders.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Orders.findOneAndDelete(query, options).select(select);
    return result;
  };

  static findManyAndDelete = async ({ query = {}, options = {} }) => {
    const result = await Orders.deleteMany(query, options);
    return result;
  };

  static createOne = async ({ data = {}, options = {} }) => {
    const result = await Orders.create([data], options);
    return result[0];
  };
}

module.exports = OrderRepository;
