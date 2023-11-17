"use strict";

const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const CartsService = require("../services/carts.service");
const CartItemsService = require("../services/cart.items.service");
const ProductsService = require("../services/products.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { PRODUCT_PAGINATION } = require("../configs/config.product.pagination");

class CartItemsController {
  getAllUserCartItems = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;

    let cart = await CartsService.findOneByUser({
      userId,
    });
    // if cart doesn't exist -> create new cart
    if (!cart) {
      cart = await CartsService.createCart({
        userId,
      });
    }
    const findAllCartItems = await CartItemsService.findAllByCart({
      cartId: cart._id,
    });
    // filter all invalid product

    let results = findAllCartItems.filter((item) => {
      if (item.data.product !== null) {
        if (item.data.product.status === false) {
          return false;
        }
        return true;
      }
      return false;
    });

    return new OkResponse({
      data: results,
      metadata: {
        userId,
        results: results.length,
      },
    }).send(res);
  });
  getUserCartItems = catchAsync(async (req, res, next) => {
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
    const findCartItems = await CartItemsService.findItemsByCart({
      cartdId: cart._id,
      limitItems,
      skipItems,
    });
    return new OkResponse({
      data: findCartItems,
      metadata: {
        page: currentPage,
        limit: limitItems,
        userId,
        results: findCartItems.length,
      },
    }).send(res);
  });
  createCartItem = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { productId, productQuantities, productSize } = req.body;
    if (!productId || !productQuantities || !productSize) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check user has a cart?
    let cart = await CartsService.findOneByUser({
      userId,
    });
    // if not -> create new cart
    if (!cart) {
      cart = await CartsService.createCart({
        userId,
      });
    }
    // Check product is valid
    const product = await ProductsService.findDetailProduct({
      productId,
    });
    if (!product) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }
    // Check cart has product:

    const checkCartItem = await CartItemsService.findOneByProduct({
      userId,
      productId,
      sizeId: productSize,
    });
    if (checkCartItem) {
      return next(new BadRequestError(CART_MESSAGES.PRODUCT_IS_EXISTS));
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
    const cartItem = await CartItemsService.createNewCartItem({
      userId,
      cartId: cart._id,
      data: {
        productId: productId,
        size: productSize,
        quantities: productQuantities,
      },
    });

    return new CreatedResponse({
      message: CART_MESSAGES.ADD_PRODUCT_SUCCESS,
      data: cartItem,
    }).send(res);
  });
  updateQuantitiesCartItem = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { cartItemId, productQuantitiesUpdate } = req.body;
    if (!cartItemId || !productQuantitiesUpdate) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check cart item is valid
    const cartItem = await CartItemsService.findOneById({
      cartItemId,
      userId,
    });
    if (!cartItem) {
      return next(new BadRequestError(CART_MESSAGES.CART_ITEM_IS_NOT_VALID));
    }
    // Check product is valid
    const product = await ProductsService.findDetailProduct({
      productId: cartItem.data.product,
    });
    if (!product) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }
    // Check product quantities
    const checkAvailableProduct = await ProductsService.checkAvailableProduct({
      productId: cartItem.data.product,
      productQuantities: productQuantitiesUpdate,
      productSize: cartItem.data.size,
    });
    if (!checkAvailableProduct) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_AVAILABLE));
    }

    // Update quantites
    await CartItemsService.updateQuantities({
      quantitiesUpdate: productQuantitiesUpdate,
      cartItemId,
    });

    return new OkResponse({
      message: CART_MESSAGES.UPDATE_QUANTITIES_SUCCESS,
    }).send(res);
  });
  deleteCartItem = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { cartItemId } = req.body;
    if (!cartItemId) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check cart item is valid
    const cartItem = await CartItemsService.findOneById({
      cartItemId,
      userId,
    });
    if (!cartItem) {
      return next(new BadRequestError(CART_MESSAGES.CART_ITEM_IS_NOT_VALID));
    }

    // delete cart item
    await CartItemsService.deleteCartItemById({
      userId,
      cartItemId,
    });

    return new OkResponse({
      message: CART_MESSAGES.REMOVE_PRODUCT_SUCCESS,
    }).send(res);
  });
}

module.exports = new CartItemsController();
