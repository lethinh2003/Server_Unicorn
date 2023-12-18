"use strict";
const ProductSales = require("../models/ProductSales");

class ProductSalesService {
  static createSaleEvent = async ({ sale_event_name, sale_discount_percentage, sale_start_date, sale_end_date }) => {
    const item = new ProductSales({
      sale_event_name,
      sale_discount_percentage,
      sale_start_date,
      sale_end_date,
    });
    await item.save();
    return item;
  };
  static findAllSaleEvents = async () => {
    const results = await ProductSales.find({
      status: true,
    });
    return results;
  };
}
module.exports = ProductSalesService;
