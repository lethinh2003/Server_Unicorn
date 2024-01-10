"use strict";
const ProductSizeRepository = require("../models/repositories/product.size.repository");

class ProductSizesService {
  static getAllSizes = async ({}) => {
    const results = await ProductSizeRepository.findAll({
      query: {
        status: true,
      },
    });
    return results;
  };
}
module.exports = ProductSizesService;
