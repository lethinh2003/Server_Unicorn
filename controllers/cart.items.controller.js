"use strict";

const { CART_MESSAGES } = require("../configs/config.cart.messages");

const CartItemsService = require("../services/cart.items.service");

const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");

class CartItemsController {
  getAllUserCartItems = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;

    const results = await CartItemsService.getAllUserCartItems({
      userId,
    });

    return new OkResponse({
      data: results,
      metadata: {
        userId,
        results: results.length,
      },
    }).send(res);
  });

  createCartItem = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId, productQuantities, productSize } = req.body;
    const cartItem = await CartItemsService.createCartItem({
      userId,
      productId,
      productQuantities,
      productSize,
    });

    return new CreatedResponse({
      message: CART_MESSAGES.ADD_PRODUCT_SUCCESS,
      data: cartItem,
      metadata: {
        ...req.body,
        userId,
      },
    }).send(res);
  });
  updateQuantitiesCartItem = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { cartItemId, productQuantitiesUpdate } = req.body;
    await CartItemsService.updateQuantitiesCartItem({
      userId,
      cartItemId,
      productQuantitiesUpdate,
    });

    return new OkResponse({
      message: CART_MESSAGES.UPDATE_QUANTITIES_SUCCESS,
      metadata: {
        ...req.body,
        userId,
      },
    }).send(res);
  });
  deleteCartItem = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { cartItemId } = req.body;
    await CartItemsService.deleteCartItem({
      cartItemId,
      userId,
    });
    return new OkResponse({
      message: CART_MESSAGES.REMOVE_PRODUCT_SUCCESS,
      metadata: {
        ...req.body,
        userId,
      },
    }).send(res);
  });
}

module.exports = new CartItemsController();
