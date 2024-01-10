"use strict";
const { USER_MESSAGES } = require("../configs/config.user.messages");
const ProductSaleRepository = require("../models/repositories/product.sale.repository");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");

class ProductSalesService {
  static createSaleEvent = async ({ sale_event_name, sale_discount_percentage, sale_start_date, sale_end_date }) => {
    if (!sale_event_name || !sale_discount_percentage || !sale_start_date || !sale_end_date) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const { _doc } = await ProductSaleRepository.createOne({
      data: {
        sale_event_name,
        sale_discount_percentage,
        sale_start_date,
        sale_end_date,
      },
    });
    return _doc;
  };
  ///
}
module.exports = ProductSalesService;
