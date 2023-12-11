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
const { CART_PAYMENT_METHOD, SHIPPING_COST, ORDER_STATUS, ONLINE_PAYMENT_TYPE } = require("../configs/config.orders");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const { VOUCHER_TYPES } = require("../configs/config.voucher.types");
const OrdersService = require("../services/orders.service");
const OrderItemsService = require("../services/order.items.service");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const QueryString = require("qs");
var cron = require("node-cron");
const cronTasksService = require("../services/cron.tasks.service");
const HistoryOnlinePaymentsFactory = require("../services/history.online.payment.service");
const { selectFields } = require("../utils/selectFields");
const OrderItems = require("../models/OrderItems");

const ORDER_QUERY_TYPE = { ...ORDER_STATUS, ALL: "all" };

class OrdersController {
  getDetailedOrder = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const { orderId } = req.params;
    const result = await OrdersService.findByIdAndUserId({ _id: orderId, userId: _id });
    if (!result) {
      return next(new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS));
    }
    // get order items
    const listOrderItems = await OrderItemsService.findByOrderId({ orderId });

    return new OkResponse({
      data: { ...result, listOrderItems: listOrderItems },
    }).send(res);
  });

  getListOrders = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page, type = ORDER_QUERY_TYPE.ALL } = req.query;
    const { _id: userId } = req.user;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await OrdersService.findOrders({
      userId,
      limitItems,
      skipItems,
      type,
    });
    for (const item of results) {
      const getOrderItems = await OrderItemsService.findByOrderId({
        orderId: item._id,
      });
      item["order_items"] = getOrderItems;
    }

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        type,
        userId,
        results: results.length,
      },
    }).send(res);
  });

  cancelOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.body;
    const { _id: userId } = req.user;
    if (!orderId) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    const session = await mongoose.startSession();
    const options = { session };
    try {
      await session.withTransaction(async () => {
        const findOrder = await OrdersService.findByIdAndUser({ _id: orderId, userId: userId, options });
        if (findOrder) {
          if (
            findOrder.order_status === ORDER_STATUS.PAYMENT_PENDING ||
            findOrder.order_status === ORDER_STATUS.PENDING ||
            findOrder.order_status === ORDER_STATUS.DELIVERING
          ) {
            // Update canceled status order
            await OrdersService.updateOneById({
              _id: orderId,
              update: {
                order_status: ORDER_STATUS.CANCELLED,
              },
              options,
            });

            // Restore quantity products
            const listOrderItems = await OrderItemsService.findByOrderId({
              orderId: orderId,
              options,
            });
            const listProducts = listOrderItems.map((orderItem) => orderItem.data);

            const listUpdateQuantityProducts = listProducts.map((item) => {
              return ProductsService.increseQuantityProduct({
                productId: item.product,
                productSize: item.size,
                productQuantities: item.quantities,
                options,
              });
            });
            await Promise.all(listUpdateQuantityProducts);
          } else {
            throw new BadRequestError(ORDER_MESSAGES.CANNOT_CANCEL);
          }
        } else {
          throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
        }
      }, options);
    } catch (err) {
      throw err;
    } finally {
      session.endSession();
    }
    return new OkResponse({
      message: ORDER_MESSAGES.CANCEL_ORDER_SUCCESS,
    }).send(res);
  });

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
          if (item.data.product.product_sale_event) {
            const discountPercent = item.data.product.product_sale_event.sale_discount_percentage;
            totalPrice +=
              Math.round(item.data.product.product_original_price - (discountPercent * item.data.product.product_original_price) / 100) *
              item.data.quantities;
          } else {
            totalPrice += item.data.product.product_original_price * item.data.quantities;
          }
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
      const { provine, district, ward, full_name, phone_number, detail_address } = checkAddressIsExist;
      const { discount, min_order_quantity, min_order_amount, type, code, description, expired_date, createdAt } =
        checkVoucherIsExists || {};

      const newOrder = await OrdersService.createOrder({
        paymentMethod,
        userId,
        voucher: voucher ? { discount, min_order_quantity, min_order_amount, type, code, description, expired_date, createdAt } : undefined,
        address: { provine, district, ward, full_name, phone_number, detail_address },
        note,
        subTotal,
        shippingCost,
        discountAmount,
        total,
        options,
      });

      // Create order items

      const listCreateOrderItems = listCartItems.map((cartItem) => {
        const { _id, product_images, product_gender, product_original_price, product_name, product_color, product_sale_event } =
          cartItem.data.product;
        const { _id: sizeId, product_size_name } = cartItem.data.size;
        const totalAmount = Math.round(cartItem.data.product.product_original_price * cartItem.data.quantities);
        return OrderItemsService.createOrderItem({
          userId,
          orderId: newOrder._id,
          data: {
            product: { _id, product_images, product_gender, product_original_price, product_name, product_color, product_sale_event },
            size: { _id: sizeId, product_size_name },
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

      // If banking method -> create 1 cron job check 10 minutes after new order was created
      if (paymentMethod === CART_PAYMENT_METHOD.BANKING) {
        const MAXIMUM_MINUTES_BANKING_PENDING = 10;
        cronTasksService.startOneTaskAfterTime({
          time: MAXIMUM_MINUTES_BANKING_PENDING * 60 * 1000,
          callback: async () => {
            const session = await mongoose.startSession();
            const options = { session };
            try {
              // if after 10 minutes, the order doesn't payment -> cancel order
              await session.withTransaction(async () => {
                const findOrder = await OrdersService.findById({ _id: newOrder._id, options });
                if (findOrder) {
                  if (findOrder.order_status === ORDER_STATUS.PAYMENT_PENDING) {
                    // Update canceled status order
                    await OrdersService.updateOneById({
                      _id: newOrder._id,
                      update: {
                        order_status: ORDER_STATUS.CANCELLED,
                      },
                      options,
                    });

                    // Restore quantity products

                    const listOrderItems = await OrderItemsService.findByOrderId({
                      orderId: newOrder._id,
                      options,
                    });
                    const listProducts = listOrderItems.map((orderItem) => orderItem.data);

                    const listUpdateQuantityProducts = listProducts.map((item) => {
                      return ProductsService.increseQuantityProduct({
                        productId: item.product,
                        productSize: item.size,
                        productQuantities: item.quantities,
                        options,
                      });
                    });
                    await Promise.all(listUpdateQuantityProducts);
                  }
                }
              }, options);
            } catch (err) {
              throw err;
            } finally {
              session.endSession();
            }
          },
        });
      }

      await session.commitTransaction();
      return new CreatedResponse({
        data: newOrder,
        message: ORDER_MESSAGES.CREATE_ORDER_SUCCESS,
      }).send(res);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  });
  checkVNPay = catchAsync(async (req, res, next) => {
    const { vnp_Params } = req.body;
    let {
      vnp_TxnRef,
      vnp_Amount,
      vnp_ResponseCode,
      vnp_TransactionStatus,
      vnp_SecureHash,
      vnp_TmnCode,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_PayDate,
      vnp_OrderInfo,
      vnp_TransactionNo,
    } = vnp_Params;

    if (!vnp_SecureHash || !vnp_TxnRef || !vnp_Amount || !vnp_ResponseCode || !vnp_TmnCode) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    let secureHash = vnp_SecureHash;
    let tmnCode = process.env.VNPAY_TMNCODE || "";
    let secretKey = process.env.VNPAY_HASHSECRET || "";
    vnp_Params["vnp_SecureHash"] = undefined;
    let signData = QueryString.stringify(vnp_Params, { encode: false });
    let signed = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
    console.log(secureHash, signed);
    if (secureHash !== signed) {
      return next(new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_ERROR));
    }
    const checkOrderExist = await OrdersService.findById({ _id: vnp_TxnRef });
    if (!checkOrderExist) {
      return next(new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS));
    }
    vnp_Amount = (vnp_Amount * 1) / 100;
    if (checkOrderExist.total !== vnp_Amount) {
      return next(new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_AMOUNT_INVALID));
    }
    if (checkOrderExist.order_status !== ORDER_STATUS.PAYMENT_PENDING) {
      return next(new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_ALREADY));
    }

    // Insert History
    await HistoryOnlinePaymentsFactory.createNewHistory({
      type: ONLINE_PAYMENT_TYPE.VNPAY,
      payload: {
        user_id: checkOrderExist.user,
        order_id: checkOrderExist._id,
        online_payment_type: ONLINE_PAYMENT_TYPE.VNPAY,
        data: {
          vnp_TxnRef,
          vnp_Amount,
          vnp_ResponseCode,
          vnp_TransactionStatus,
          vnp_TmnCode,
          vnp_BankCode,
          vnp_BankTranNo,
          vnp_CardType,
          vnp_PayDate,
          vnp_OrderInfo,
          vnp_TransactionNo,
        },
      },
    });

    // Giao dịch thất bại
    if (vnp_ResponseCode !== "00") {
      return next(new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_ERROR));
    }
    await OrdersService.updateOneById({
      _id: checkOrderExist._id,
      update: {
        order_status: ORDER_STATUS.PENDING,
      },
    });

    return new OkResponse({
      message: ORDER_MESSAGES.ONLINE_PAYMENT_SUCCESS,
    }).send(res);
  });
}

module.exports = new OrdersController();
