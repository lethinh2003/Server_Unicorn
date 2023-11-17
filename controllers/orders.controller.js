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
const { CART_PAYMENT_METHOD, SHIPPING_COST } = require("../configs/config.orders");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const { VOUCHER_TYPES } = require("../configs/config.voucher.types");
const OrdersService = require("../services/orders.service");
const OrderItemsService = require("../services/order.items.service");
const mongoose = require("mongoose");

class OrdersController {
  createOrder = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { _id: userId } = req.user;
      const { note, voucher, address, paymentMethod } = req.body;
      if (!paymentMethod || !address) {
        throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
      }
      // check payment method is valid
      if (!Object.values(CART_PAYMENT_METHOD).includes(paymentMethod)) {
        throw new UnauthorizedError(ORDER_MESSAGES.PAYMENT_METHOD_IS_NOT_EXISTS);
      }
      const options = { session };
      // Check user has a cart?
      const checkCartIsExists = await CartsService.findOneByUser({
        userId,
        options,
      });
      if (!checkCartIsExists) {
        throw new BadRequestError(CART_MESSAGES.CART_IS_NOT_EXISTS);
      }

      // PRODUCT
      // Check products
      const getListCartItems = await CartItemsService.findAllByCart({
        cartId: checkCartIsExists._id,
        options,
      });

      // filter products invalid
      let listCartItems = CartItemsService.listRemoveInvalidProducts({
        listCartItems: getListCartItems,
      });

      // Check cart items is empty?
      if (listCartItems.length === 0) {
        throw new BadRequestError(ORDER_MESSAGES.MIN_CART_ITEMS_REQUIRED);
      }

      // Check quantity product

      const listCheckQuantityProducts = listCartItems.map((cartItem) => {
        const checkAvailableProduct = ProductsService.checkAvailableProduct({
          productId: cartItem.data.product._id,
          productQuantities: cartItem.data.quantities,
          productSize: cartItem.data.size._id,
          options,
        });
        return checkAvailableProduct;
      });

      const checkQuantityProducts = await Promise.all(listCheckQuantityProducts);
      if (checkQuantityProducts.includes(false)) {
        throw new BadRequestError(ORDER_MESSAGES.PRODUCT_ITEMS_QUANTITIES_INVALID);
      }

      // ADDRESS
      // Check address is valid
      const checkAddressIsExist = await UserAddressesService.findAddressesByUserAndId({
        userId,
        addressId: address._id,
        options,
      });
      if (!checkAddressIsExist) {
        throw new BadRequestError(USER_MESSAGES.ADDRESS_INVALID);
      }

      // VOUCHER
      let checkVoucherIsExists = null;
      if (voucher) {
        // Check voucher is valid
        checkVoucherIsExists = await VouchersService.checkVoucherApplyIsValid({
          userId,
          voucherId: voucher._id,
          listCartItems,
          options,
        });
      }
      // Calculate amount
      const shippingCost = SHIPPING_COST;
      const subTotal = (() => {
        let totalPrice = 0;
        listCartItems?.forEach((item) => {
          totalPrice += item.data.product.product_original_price * item.data.quantities;
        });
        return totalPrice;
      })();
      let total = 0;
      let discountAmount = 0;
      if (!voucher) {
        total = subTotal + shippingCost;
      } else {
        if (checkVoucherIsExists.type === VOUCHER_TYPES.FREE_SHIP) {
          const shippingDiscount = Math.round((shippingCost * checkVoucherIsExists.discount) / 100);
          discountAmount = shippingDiscount;
          total = subTotal + shippingCost - discountAmount;
        }
        if (checkVoucherIsExists.type === VOUCHER_TYPES.AMOUNT) {
          const totalDiscount = Math.round((subTotal * checkVoucherIsExists.discount) / 100);
          discountAmount = totalDiscount;
          total = subTotal + shippingCost - discountAmount;
        }
      }
      // Create new order
      const newOrder = await OrdersService.createOrder({
        userId,
        voucherId: voucher ? voucher._id : undefined,
        addressId: checkAddressIsExist._id,
        note,
        subTotal,
        shippingCost,
        discountAmount,
        total,
        options,
      });

      // Create order items

      const listCreateOrderItems = listCartItems.map((cartItem) => {
        const totalAmount = Math.round(cartItem.data.product.product_original_price * cartItem.data.quantities);
        return OrderItemsService.createOrderItem({
          userId,
          orderId: newOrder._id,
          data: {
            productId: cartItem.data.product._id,
            size: cartItem.data.size._id,
            quantities: cartItem.data.quantities,
            totalAmount,
          },
          options,
        });
      });

      await Promise.all(listCreateOrderItems);

      // Delete all cart items
      await CartItemsService.deleteCartItemsByCartId({
        userId,
        cartId: checkCartIsExists._id,
        options,
      });

      // Update status voucher
      if (voucher) {
        await VouchersService.updateStatusById({
          userId,
          voucherId: checkVoucherIsExists._id,
          status: false,
          options,
        });
      }
      // Update quantities products
      const listUpdateQuantityProducts = listCartItems.map((cartItem) => {
        return ProductsService.decreseQuantityProduct({
          productId: cartItem.data.product._id,
          productSize: cartItem.data.size._id,
          productQuantities: cartItem.data.quantities,
          options,
        });
      });
      await Promise.all(listUpdateQuantityProducts);

      await session.commitTransaction();
      return new CreatedResponse({
        message: ORDER_MESSAGES.CREATE_ORDER_SUCCESS,
      }).send(res);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  });
}

module.exports = new OrdersController();
