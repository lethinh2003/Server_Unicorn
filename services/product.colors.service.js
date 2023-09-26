"use strict";
const ProductColors = require("../models/ProductColors");

class ProductColorsService {
  static findAllColors = async ({}) => {
    const results = await ProductColors.find({}).lean();
    return results;
  };
  static createColor = async ({ name, code }) => {
    const result = await ProductColors.create({
      product_color_name: name,
      product_color_code: code,
    });
    return result;
  };
}
module.exports = ProductColorsService;
