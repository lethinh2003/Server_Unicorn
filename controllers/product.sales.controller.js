"use strict";

const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const ProductSalesService = require("../services/product.sales.service");
const ProductSizesService = require("../services/product.sizes.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class ProductSalesController {
  createSaleEvent = catchAsync(async (req, res, next) => {
    const { sale_event_name, sale_discount_percentage, sale_start_date, sale_end_date } = req.body;
    if (!sale_event_name || !sale_discount_percentage || !sale_start_date || !sale_end_date) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    const result = await ProductSalesService.createSaleEvent({ sale_event_name, sale_discount_percentage, sale_start_date, sale_end_date });
    if (!result) {
      return next(new BadRequestError(PRODUCT_MESSAGES.SALE_EVENT_CREATE_FAILURE));
    }
    return new CreatedResponse({
      data: result,
    }).send(res);
  });
}

module.exports = new ProductSalesController();
