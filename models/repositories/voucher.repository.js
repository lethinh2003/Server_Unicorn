const Vouchers = require("../Vouchers");

class VoucherRepository {
  static find = async ({ query = {}, limit, skip, select, sort, populate }) => {
    const results = await Vouchers.find(query).skip(skip).limit(limit).sort(sort).select(select).populate(populate).lean();

    return results;
  };

  static countDocuments = async ({ query = {} }) => {
    const result = await Vouchers.countDocuments(query);
    return result;
  };
  static findAll = async ({ query = {}, select = "", populate }) => {
    const result = await Vouchers.find(query).select(select).populate(populate).lean();
    return result;
  };
  static findOne = async ({ query = {}, select = "", populate }) => {
    const result = await Vouchers.findOne(query).select(select).populate(populate).lean();
    return result;
  };
  static findOneAndUpdate = async ({ query = {}, select = "", update = {}, options = {} }) => {
    const result = await Vouchers.findOneAndUpdate(query, update, options).select(select);
    return result;
  };
  static findOneAndDelete = async ({ query = {}, select = "", options = {} }) => {
    const result = await Vouchers.findOneAndDelete(query, options).select(select);
    return result;
  };
  static findManyAndDelete = async ({ query = {}, options = {} }) => {
    const result = await Vouchers.deleteMany(query, options);
    return result;
  };
  static updateExpiredVouchers = async ({ userId }) => {
    const result = await Vouchers.updateExpiredVouchers({
      userId,
    });
    return result;
  };

  static createOne = async ({ data = {} }) => {
    const result = await Vouchers.create(data);
    return result;
  };
}

module.exports = VoucherRepository;
