const Users = require("../Users");

class UserRepository {
  static find = async ({ query = {}, limit, skip, select, sort }) => {
    const results = await Users.find(query).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await Users.find(query).select(select).populate(populate).lean();
    return result;
  };

  static findOne = async ({ query = {}, select = "" }) => {
    const result = await Users.findOne(query).select(select).lean();
    return result;
  };
  static countDocuments = async ({ query = {} }) => {
    const result = await Users.countDocuments(query);
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Users.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Users.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await Users.create(data);
    return result;
  };
}

module.exports = UserRepository;
