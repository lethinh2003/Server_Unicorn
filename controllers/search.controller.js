"use strict";

const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const CartsService = require("../services/carts.service");
const VouchersService = require("../services/vouchers.service");
const CartItemsService = require("../services/cart.items.service");
const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const UserAddressesService = require("../services/user.addessses.service");
const { CART_PAYMENT_METHOD, SHIPPING_COST, ORDER_STATUS } = require("../configs/config.orders");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const { VOUCHER_TYPES } = require("../configs/config.voucher.types");
const OrdersService = require("../services/orders.service");
const OrderItemsService = require("../services/order.items.service");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const QueryString = require("qs");
const sortObject = require("../utils/sortObject");

class SearchController {
  searchProduct = catchAsync(async (req, res, next) => {
    const { query } = req.query;

    const results = await ProductsService.searchProducts({ query });
    return new OkResponse({
      data: results,
      metadata: {
        query,
        results: results.length,
      },
    }).send(res);
  });
}

module.exports = new SearchController();
