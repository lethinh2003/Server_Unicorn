"use strict";

const ProductSalesService = require("../services/product.sales.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class ProductSalesController {
  createSaleEvent = catchAsync(async (req, res, next) => {
    const { sale_event_name, sale_discount_percentage, sale_start_date, sale_end_date } = req.body;

    const result = await ProductSalesService.createSaleEvent({ sale_event_name, sale_discount_percentage, sale_start_date, sale_end_date });
    return new CreatedResponse({
      data: result,
      metadata: {
        ...req.body,
      },
    }).send(res);
  });
}

module.exports = new ProductSalesController();
