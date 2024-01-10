"use strict";

const ProductColorRepository = require("../models/repositories/product.color.repository");

class ProductColorsService {
  static getAllColors = async ({}) => {
    const results = await ProductColorRepository.findAll({
      query: {
        status: true,
      },
    });
    return results;
  };
}
module.exports = ProductColorsService;
