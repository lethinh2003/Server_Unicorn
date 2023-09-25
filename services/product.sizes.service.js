"use strict";
const ProductSizes = require("../models/ProductSizes");

class ProductSizesService {
  static findAllSizes = async ({}) => {
    const results = await ProductSizes.find({});
    return results;
  };
}
module.exports = ProductSizesService;
