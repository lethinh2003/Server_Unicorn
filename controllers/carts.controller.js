"use strict";

const CartsService = require("../services/carts.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class CartsController {
  getUserCart = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const cart = await CartsService.getUserCart({
      userId,
    });

    return new OkResponse({
      data: cart,
      metadata: {
        userId,
      },
    }).send(res);
  });

  checkVoucher = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { voucherId } = req.body;
    await CartsService.checkVoucher({
      userId,
      voucherId,
    });

    return new OkResponse({
      metadata: {
        ...req.body,
        userId,
      },
    }).send(res);
  });
}

module.exports = new CartsController();
