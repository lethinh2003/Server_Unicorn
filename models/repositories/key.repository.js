const Keys = require("../Keys");

class KeyRepository {
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await Keys.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Keys.findOneAndUpdate(query, update, options).select(select);
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await Keys.create(data);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, options = {} }) => {
    const result = await Keys.findOneAndDelete(query, options);
    return result;
  };
}

module.exports = KeyRepository;
