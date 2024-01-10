const UserAddresses = require("../UserAddresses");

class UserAddressesRepository {
  static find = async ({ query = {}, limit, skip, select, sort }) => {
    const results = await UserAddresses.find(query).skip(skip).limit(limit).sort(sort).select(select).lean();

    return results;
  };

  static findAll = async ({ query = {}, select = "" }) => {
    const result = await UserAddresses.find(query).select(select).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "" }) => {
    const result = await UserAddresses.findOne(query).select(select).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await UserAddresses.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await UserAddresses.findOneAndDelete(query, options).select(select);
    return result;
  };
  static findManyAndDelete = async ({ query = {}, options = {} }) => {
    const result = await UserAddresses.deleteMany(query, options);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await UserAddresses.create(data);
    return result;
  };
}

module.exports = UserAddressesRepository;
