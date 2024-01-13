"use strict";
const { USER_MESSAGES } = require("../configs/config.user.messages");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const UserAddressesRepository = require("../models/repositories/user.address.repository");
class UserAddressesService {
  static getUserAddresses = async ({ itemsOfPage, page, userId }) => {
    const limitItems = itemsOfPage * 1 || 10;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await UserAddressesRepository.find({
      query: {
        user_id: userId,
        status: true,
      },
      select: "-__v",
      limit: limitItems,
      skip: skipItems,
      sort: "-default",
    });
    return results;
  };
  static createAddress = async ({ provine, district, ward, fullName, phoneNumber, detailAddress, isDefault = false, userId }) => {
    if (!provine || !district || !ward || !fullName || !phoneNumber || !detailAddress) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    let isAddressDefault = true;
    // Check user has any address?
    const checkUserAddresses = await UserAddressesRepository.findAll({
      query: {
        user_id: userId,
        status: true,
      },
    });
    if (checkUserAddresses.length > 0) {
      isAddressDefault = false;
    }
    if (isDefault) {
      // Remove current default address
      await UserAddressesRepository.findOneAndUpdate({
        query: {
          default: true,
        },
        update: { default: false },
      });
      isAddressDefault = true;
    }
    const result = await UserAddressesRepository.createOne({
      data: {
        user_id: userId,
        default: isAddressDefault,
        provine,
        district,
        ward,
        full_name: fullName,
        phone_number: phoneNumber,
        detail_address: detailAddress,
      },
    });
    return result;
  };
  static updateAddress = async ({ userId, addressId, provine, district, ward, fullName, phoneNumber, detailAddress, isDefault }) => {
    if (!addressId || !provine || !district || !ward || !fullName || !phoneNumber || !detailAddress) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check address is exists?
    const checkAddressExist = await UserAddressesRepository.findOne({
      query: {
        user_id: userId,
        _id: addressId,
        status: true,
      },
    });
    if (!checkAddressExist) {
      throw new NotFoundError(USER_MESSAGES.ADDRESS_INVALID);
    }
    if (isDefault) {
      // Remove current default address
      await UserAddressesRepository.findOneAndUpdate({
        query: {
          default: true,
        },
        update: { default: false },
      });
    }
    // Update address
    await UserAddressesRepository.findOneAndUpdate({
      query: {
        user_id: userId,
        _id: addressId,
      },
      update: {
        default: isDefault,
        provine,
        district,
        ward,
        full_name: fullName,
        phone_number: phoneNumber,
        detail_address: detailAddress,
      },
    });
  };
  static deleteAddress = async ({ addressId, userId }) => {
    if (!addressId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check address is exists?
    const checkAddressExist = await UserAddressesRepository.findOne({
      query: {
        user_id: userId,
        _id: addressId,
      },
    });
    if (!checkAddressExist) {
      throw new NotFoundError(USER_MESSAGES.ADDRESS_INVALID);
    }
    // Delete address
    await UserAddressesRepository.findOneAndDelete({
      query: {
        user_id: userId,
        _id: addressId,
      },
    });
  };
  static getDetailUserAddresses = async ({ addressId, userId }) => {
    const result = await UserAddressesRepository.findOne({
      query: {
        user_id: userId,
        _id: addressId,
        status: true,
      },
      select: "-__v",
    });
    if (!result) {
      throw new NotFoundError(USER_MESSAGES.ADDRESS_INVALID);
    }
    return result;
  };

  ///
}
module.exports = UserAddressesService;
