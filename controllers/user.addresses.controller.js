"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const UserAddressesService = require("../services/user.addessses.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { CreatedResponse, OkResponse } = require("../utils/success_response");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");

class UserAddressesController {
  getDetailUserAddresses = catchAsync(async (req, res, next) => {
    const { addressId } = req.params;
    const { _id: userId } = req.user;
    const result = await UserAddressesService.findAddressesByUserAndId({
      userId,
      addressId,
    });
    if (!result) {
      return next(new NotFoundError(USER_MESSAGES.ADDRESS_INVALID));
    }

    return new OkResponse({
      data: result,
      metadata: {
        addressId,
        userId,
      },
    }).send(res);
  });
  getUserAddresses = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;

    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await UserAddressesService.findAddressesPaginationByUser({
      userId,
      limitItems,
      skipItems,
    });

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        userId,
        results: results.length,
      },
    }).send(res);
  });
  createAddress = catchAsync(async (req, res, next) => {
    const { provine, district, ward, fullName, phoneNumber, detailAddress, isDefault = false } = req.body;
    const { _id: userId } = req.user;
    if (!provine || !district || !ward || !fullName || !phoneNumber || !detailAddress) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    let isAddressDefault = true;
    // Check user has any address?
    const checkUserAddresses = await UserAddressesService.findAddressesByUser({
      userId,
    });
    if (checkUserAddresses.length > 0) {
      isAddressDefault = false;
    }
    if (isDefault) {
      // Remove current default address
      await UserAddressesService.updateDefaultAddress({
        oldDefault: true,
        newDefault: false,
      });
      isAddressDefault = true;
    }
    const addressCreated = await UserAddressesService.createAddress({
      isDefault: isAddressDefault,
      userId,
      provine,
      district,
      ward,
      fullName,
      phoneNumber,
      detailAddress,
    });
    return new CreatedResponse({
      message: USER_MESSAGES.ADD_ADDRESS_SUCCESS,
    }).send(res);
  });

  deleteAddress = catchAsync(async (req, res, next) => {
    const { addressId } = req.body;
    const { _id: userId } = req.user;
    if (!addressId) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check address is exists?
    const checkAddressExist = await UserAddressesService.findAddressesByUserAndId({
      userId,
      addressId,
    });
    if (!checkAddressExist) {
      return next(new NotFoundError(USER_MESSAGES.ADDRESS_INVALID));
    }
    // Delete address
    await UserAddressesService.deleteAddressesByUserAndId({
      userId,
      addressId,
    });
    return new OkResponse({
      message: USER_MESSAGES.DELETE_ADDRESS_SUCCESS,
    }).send(res);
  });
  updateAddress = catchAsync(async (req, res, next) => {
    const { addressId, provine, district, ward, fullName, phoneNumber, detailAddress, isDefault = false } = req.body;
    const { _id: userId } = req.user;
    if (!addressId || !provine || !district || !ward || !fullName || !phoneNumber || !detailAddress) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check address is exists?
    const checkAddressExist = await UserAddressesService.findAddressesByUserAndId({
      userId,
      addressId,
    });
    if (!checkAddressExist) {
      return next(new NotFoundError(USER_MESSAGES.ADDRESS_INVALID));
    }
    if (isDefault) {
      // Remove current default address
      await UserAddressesService.updateDefaultAddress({
        oldDefault: true,
        newDefault: false,
      });
    }
    // Update address
    await UserAddressesService.updateAddress({
      userId,
      addressId,
      provine,
      district,
      ward,
      fullName,
      phoneNumber,
      detailAddress,
      isDefault,
    });
    return new OkResponse({
      message: USER_MESSAGES.UPDATE_ADDRESS_SUCCESS,
    }).send(res);
  });
}

module.exports = new UserAddressesController();
