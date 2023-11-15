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

class CartsController {
  getUserCart = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;

    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;

    let cart = await CartsService.findOneByUser({
      userId,
    });
    // if cart doesn't exist -> create new cart
    if (!cart) {
      cart = await CartsService.createCart({
        userId,
      });
    }
    const findCartItems = await CartItemsService.findAllByCart({
      cartdId: cart._id,
      limitItems,
      skipItems,
    });
    return new OkResponse({
      data: { ...cart, items: findCartItems },
      metadata: {
        page: currentPage,
        limit: limitItems,
        userId,
        results: findCartItems.length,
      },
    }).send(res);
  });
  createCart = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    // Check user has a cart?
    const checkCartIsExists = await CartsService.findOneByUser({
      userId,
    });
    if (checkCartIsExists) {
      return next(new BadRequestError(CART_MESSAGES.CART_IS_EXISTS));
    }
    // Create new cart
    await CartsService.createCart({
      userId,
    });
    return new CreatedResponse({
      message: CART_MESSAGES.ADD_CART_SUCCESS,
    }).send(res);
  });
  addProduct = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId, productQuantities, productSize } = req.body;
    if (!productId || !productQuantities || !productSize) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check user has a cart?
    const checkCartIsExists = await CartsService.findOneByUser({
      userId,
    });
    if (!checkCartIsExists) {
      return next(new BadRequestError(CART_MESSAGES.CART_IS_NOT_EXISTS));
    }
    // Check product is valid
    const product = await ProductsService.findDetailProduct({
      productId,
    });
    if (!product) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }
    // Check product quantities
    const checkAvailableProduct = await ProductsService.checkAvailableProduct({
      productId,
      productQuantities,
      productSize,
    });
    if (!checkAvailableProduct) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_AVAILABLE));
    }

    // Update cart products
    let price = product.product_original_price;
    // Check product is offering (sale)

    await CartsService.updateProduct({
      cartId: checkCartIsExists._id,
      product: {
        product: productId,
        size: productSize,
        quantities: productQuantities,
        price: price,
      },
    });

    return new OkResponse({
      message: CART_MESSAGES.ADD_PRODUCT_SUCCESS,
    }).send(res);
  });
  updateProduct = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId, productQuantities, productSize } = req.body;
    if (!productId || !productQuantities || !productSize) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check user has a cart?
    const checkCartIsExists = await CartsService.findOneByUser({
      userId,
    });
    if (!checkCartIsExists) {
      return next(new BadRequestError(CART_MESSAGES.CART_IS_NOT_EXISTS));
    }
    // Check product is valid
    const product = await ProductsService.findDetailProduct({
      productId,
    });
    if (!product) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }
    // Check product quantities
    const checkAvailableProduct = await ProductsService.checkAvailableProduct({
      productId,
      productQuantities,
      productSize,
    });
    if (!checkAvailableProduct) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_AVAILABLE));
    }

    // Update cart products
    let price = product.product_original_price;
    // Check product is offering (sale)

    await CartsService.updateProduct({
      cartId: checkCartIsExists._id,
      product: {
        product: productId,
        size: productSize,
        quantities: productQuantities,
        price: price,
      },
    });

    return new OkResponse({
      message: CART_MESSAGES.ADD_PRODUCT_SUCCESS,
    }).send(res);
  });
  checkVoucher = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { voucherId } = req.body;
    if (!voucherId) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check user has a cart?
    const checkCartIsExists = await CartsService.findOneByUser({
      userId,
    });
    if (!checkCartIsExists) {
      return next(new BadRequestError(CART_MESSAGES.CART_IS_NOT_EXISTS));
    }
    // Check voucher is exist
    const checkVoucherIsExists = await VouchersService.findOneByUserAndId({
      userId,
      voucherId,
    });
    if (!checkVoucherIsExists) {
      return next(new BadRequestError(VOUCHER_MESSAGES.CODE_IS_NOT_EXISTS));
    }
    // Update cart
    await CartsService.updateCartVoucher({
      userId,
      voucherId,
    });

    return new OkResponse({}).send(res);
  });
}

module.exports = new CartsController();
