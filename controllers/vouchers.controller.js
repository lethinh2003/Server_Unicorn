"use strict";

const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const VouchersService = require("../services/vouchers.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const {
  pagination: {
    limitItems: { voucher: LIMIT_ITEMS },
  },
} = require("../configs/config.pagination");
class VouchersController {
  getUserVouchers = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;

    const limitItems = itemsOfPage * 1 || LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await VouchersService.findByUser({
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
  createVoucher = catchAsync(async (req, res, next) => {
    const { code, discount, description, minOrderQuantity, minOrderAmount, expiredDate, type } = req.body;
    const { _id: userId } = req.user;
    if (!code || !discount || !description || !expiredDate || !type) {
      return next(new UnauthorizedError(VOUCHER_MESSAGES.INPUT_MISSING));
    }
    // Check user has a voucher?
    const checkVoucherIsExists = await VouchersService.findOneByUserAndCode({
      userId,
      code,
    });
    if (checkVoucherIsExists) {
      return next(new BadRequestError(VOUCHER_MESSAGES.CODE_IS_EXISTS));
    }
    // Create new voucher
    await VouchersService.createVoucher({
      userId,
      code,
      discount,
      description,
      minOrderQuantity,
      minOrderAmount,
      expiredDate,
      type,
    });
    return new CreatedResponse({
      message: VOUCHER_MESSAGES.ADD_VOUCHER_SUCCESS,
    }).send(res);
  });
}

module.exports = new VouchersController();
