const ProductRepository = require("../models/repositories/product.repository");

const checkAvailableProduct = async ({ productId, productSize, productQuantities, options = {} }) => {
  const result = await ProductRepository.findOne({
    query: {
      _id: productId,
    },
  });
  if (!result) {
    return false;
  }
  const findProductSize = result?.product_sizes?.filter((item) => item.size_type.toString() === productSize.toString())[0];
  if (!findProductSize) {
    return false;
  }
  if (findProductSize.size_quantities < productQuantities) {
    return false;
  }

  return true;
};

const increseQuantityProduct = async ({ productId, productSize, productQuantities, options = {} }) => {
  const result = await ProductRepository.findOneAndUpdate({
    query: {
      _id: productId,
      "product_sizes.size_type": productSize,
    },
    update: { $inc: { "product_sizes.$.size_quantities": productQuantities * 1 } },
    options,
  });
  return result;
};

module.exports = { increseQuantityProduct, checkAvailableProduct };
