"use strict";

const VouchersService = require("../services/vouchers.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class VouchersController {
  getUserVouchers = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page, search = "" } = req.query;
    const { _id: userId } = req.user;
    const { lastResults, countAllItems, limitItems, currentPage } = await VouchersService.getUserVouchers({
      itemsOfPage,
      page,
      userId,
      search,
    });

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
}

module.exports = new VouchersController();
