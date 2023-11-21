"use strict";
const UserAddresses = require("../models/UserAddresses");

class UserAddressesService {
  static findAllAddresses = async ({}) => {
    const results = await UserAddresses.find({}).lean();
    return results;
  };
  static findAddressesByUser = async ({ userId }) => {
    const results = await UserAddresses.find({
      user_id: userId,
      status: true,
    }).lean();

    return results;
  };
  static findAddressesPaginationByUser = async ({ userId, limitItems, skipItems }) => {
    const results = await UserAddresses.find({
      user_id: userId,
      status: true,
    })
      .skip(skipItems)
      .limit(limitItems)
      .sort("-default")
      .lean();

    return results;
  };
  static findAddressesByUserAndId = async ({ userId, addressId, options = {} }) => {
    const results = await UserAddresses.findOne(
      {
        user_id: userId,
        _id: addressId,
        status: true,
      },
      null,
      options
    ).lean();

    return results;
  };
  static findAddressesDefaultByUser = async ({ userId }) => {
    const result = await UserAddresses.findOne({
      user_id: userId,
      default: true,
    }).lean();

    return result;
  };
  static deleteAddressesByUserAndId = async ({ userId, addressId }) => {
    const result = await UserAddresses.findOneAndUpdate(
      {
        user_id: userId,
        _id: addressId,
      },
      {
        status: false,
      }
    ).lean();
    return result;
  };
  static deleteAddressesByUser = async ({ userId, options = {} }) => {
    const result = await UserAddresses.deleteMany({
      user_id: userId,
    }).session(options?.session || null);
    return result;
  };

  static createAddress = async ({ isDefault = false, userId, provine, district, ward, fullName, phoneNumber, detailAddress }) => {
    const result = await UserAddresses.create({
      user_id: userId,
      default: isDefault,
      provine,
      district,
      ward,
      full_name: fullName,
      phone_number: phoneNumber,
      detail_address: detailAddress,
    });

    return result;
  };
  static updateAddress = async ({
    addressId,
    isDefault = false,
    userId,
    provine,
    district,
    ward,
    fullName,
    phoneNumber,
    detailAddress,
  }) => {
    const result = await UserAddresses.findOneAndUpdate(
      {
        user_id: userId,
        _id: addressId,
      },
      { default: isDefault, provine, district, ward, full_name: fullName, phone_number: phoneNumber, detail_address: detailAddress }
    );

    return result;
  };
  static updateDefaultAddress = async ({ oldDefault = true, newDefault = false }) => {
    const result = await UserAddresses.findOneAndUpdate(
      {
        default: oldDefault,
      },
      { default: newDefault }
    );

    return result;
  };
}
module.exports = UserAddressesService;
