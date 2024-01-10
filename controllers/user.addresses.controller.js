"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const UserAddressesService = require("../services/user.addessses.service");
const catchAsync = require("../utils/catch_async");
const { CreatedResponse, OkResponse } = require("../utils/success_response");

class UserAddressesController {
  getDetailUserAddresses = catchAsync(async (req, res, next) => {
    const { addressId } = req.params;
    const { _id: userId } = req.user;
    return new OkResponse({
      data: await UserAddressesService.getDetailUserAddresses({ addressId, userId }),
      metadata: {
        ...req.params,
        userId,
      },
    }).send(res);
  });
  getUserAddresses = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;
    const results = await UserAddressesService.getUserAddresses({
      itemsOfPage,
      page,
      userId,
    });
    return new OkResponse({
      data: results,
      metadata: {
        page: page * 1,
        limit: itemsOfPage * 1,
        userId,
        results: results.length,
      },
    }).send(res);
  });

  createAddress = catchAsync(async (req, res, next) => {
    const { provine, district, ward, fullName, phoneNumber, detailAddress, isDefault = false } = req.body;
    const { _id: userId } = req.user;

    const addressCreated = await UserAddressesService.createAddress({
      isDefault,
      userId,
      provine,
      district,
      ward,
      fullName,
      phoneNumber,
      detailAddress,
    });

    return new CreatedResponse({
      data: addressCreated,
      message: USER_MESSAGES.ADD_ADDRESS_SUCCESS,
      metadata: { ...req.body, userId },
    }).send(res);
  });

  deleteAddress = catchAsync(async (req, res, next) => {
    const { addressId } = req.body;
    const { _id: userId } = req.user;
    // Delete address
    await UserAddressesService.deleteAddress({
      userId,
      addressId,
    });
    return new OkResponse({
      message: USER_MESSAGES.DELETE_ADDRESS_SUCCESS,
      metadata: { ...req.body, userId },
    }).send(res);
  });
  updateAddress = catchAsync(async (req, res, next) => {
    const { addressId, provine, district, ward, fullName, phoneNumber, detailAddress, isDefault = false } = req.body;
    const { _id: userId } = req.user;
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
      metadata: { ...req.body, userId },
    }).send(res);
  });
}

module.exports = new UserAddressesController();
