"use strict";

const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const CartsService = require("../services/carts.service");
const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
class CartsController {
  getUserCart = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const result = await CartsService.findOneByUser({
      userId,
      populate: "products.product products.size",
    });
    return new OkResponse({
      data: result,
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
}

module.exports = new CartsController();
