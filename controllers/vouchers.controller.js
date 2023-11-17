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
const UsersService = require("../services/users.service");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const Fuse = require("fuse.js");

class VouchersController {
  getUserVouchers = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page, search = "" } = req.query;
    const { _id: userId } = req.user;

    const limitItems = itemsOfPage * 1 || LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    // Update Expired Vouchers
    await VouchersService.updateExpiredVouchers({ userId });
    const results = await VouchersService.findByUser({
      userId,
      limitItems,
      skipItems,
    });
    const countAllItems = await VouchersService.countAllByUser({ userId });

    const fuseOptions = {
      threshold: 0.1,
      keys: ["discount", "code", "description"],
    };

    const fuse = new Fuse(results, fuseOptions);
    let lastResults = [];
    if (search) {
      lastResults = fuse.search(search).flatMap((item) => item.item);
    } else {
      lastResults = fuse._docs;
    }

    return new OkResponse({
      data: lastResults,
      metadata: {
        countAll: countAllItems,
        page: currentPage,
        limit: limitItems,
        userId,
        search,
        results: lastResults.length,
      },
    }).send(res);
  });
  createVoucher = catchAsync(async (req, res, next) => {
    const { userId, code, discount, description, minOrderQuantity, minOrderAmount, expiredDate, type } = req.body;
    if (!code || !discount || !description || !expiredDate || !type) {
      return next(new UnauthorizedError(VOUCHER_MESSAGES.INPUT_MISSING));
    }
    // Check user is exists
    const findUser = await UsersService.findById({ _id: userId });
    if (!findUser) {
      return next(new BadRequestError(USER_MESSAGES.USER_NOT_EXIST_DB));
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
