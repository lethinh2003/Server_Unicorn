const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const VoucherRepository = require("../models/repositories/voucher.repository");
const { BadRequestError } = require("./app_error");

const checkVoucherApplyIsValid = async ({ userId, voucherId, listCartItems = [] }) => {
  const result = await VoucherRepository.findOne({
    query: {
      user: userId,
      _id: voucherId,
      status: true,
    },
  });

  if (!result) {
    throw new BadRequestError(VOUCHER_MESSAGES.CODE_IS_NOT_EXISTS);
  }
  // check voucher expired
  const currentDate = new Date();
  const voucherExpiredDate = new Date(result.expired_date);
  if (currentDate > voucherExpiredDate) {
    throw new BadRequestError(VOUCHER_MESSAGES.CODE_IS_EXPIRED);
  }

  const getTotalAmountCartItems = () => {
    let totalPrice = 0;
    listCartItems.forEach((item) => {
      totalPrice += item.data.product.product_original_price * item.data.quantities;
    });
    return totalPrice;
  };
  // Check quantity cart item is ok
  if (listCartItems.length < result.min_order_quantity) {
    throw new BadRequestError(CART_MESSAGES.MIN_ORDER_QUANTITY_VOUCHER_INVALID);
  }
  // Check amount cart item is ok
  if (getTotalAmountCartItems() < result.min_order_amount) {
    throw new BadRequestError(CART_MESSAGES.MIN_ORDER_AMOUNT_VOUCHER_INVALID);
  }
  return result;
};

module.exports = { checkVoucherApplyIsValid };
