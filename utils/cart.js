const CartRepository = require("../models/repositories/cart.repository");

const checkCartIsValid = async ({ userId }) => {
  // Check user has a cart?
  let cart = await CartRepository.findOne({
    query: {
      user: userId,
      status: true,
    },
  });
  // if cart doesn't exist -> create new cart
  if (!cart) {
    const { _doc } = await CartRepository.createOne({
      data: {
        user: userId,
      },
    });
    cart = _doc;
  }
  return cart;
};

module.exports = {
  checkCartIsValid,
};
