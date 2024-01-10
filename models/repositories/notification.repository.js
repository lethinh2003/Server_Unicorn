const Notifications = require("../Notifications");

class NotificationRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await Notifications.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await Notifications.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await Notifications.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await Notifications.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Notifications.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Notifications.findOneAndDelete(query, options).select(select);
    return result;
  };

  static createOne = async ({ data = {}, options = {} }) => {
    const result = await Notifications.create([data], options);
    return result;
  };
  static updateMany = async ({ query = {}, select = "", update = {} }) => {
    const result = await Notifications.updateMany(query, update);
    return result;
  };
}

module.exports = NotificationRepository;
