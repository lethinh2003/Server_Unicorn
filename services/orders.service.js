"use strict";
const CryptoJS = require("crypto-js");
const QueryString = require("qs");
const EmailService = require("../services/email.service");
const RedisService = require("../services/redis.service");
const cronTasksService = require("../services/cron.tasks.service");
const { CART_PAYMENT_METHOD, SHIPPING_COST, ORDER_STATUS, ONLINE_PAYMENT_TYPE } = require("../configs/config.orders");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const { VOUCHER_TYPES } = require("../configs/config.voucher.types");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const { CART_MESSAGES } = require("../configs/config.cart.messages");
const OrderRepository = require("../models/repositories/order.repository");
const OrderItemRepository = require("../models/repositories/order.item.repository");
const mongoose = require("mongoose");
const CartRepository = require("../models/repositories/cart.repository");
const CartItemRepository = require("../models/repositories/cart.item.repository");
const UserAddressesRepository = require("../models/repositories/user.address.repository");
const { checkVoucherApplyIsValid } = require("../utils/voucher");
const VoucherRepository = require("../models/repositories/voucher.repository");
const { increseQuantityProduct } = require("../utils/product");
const { removeInvalidProducts } = require("../utils/cartItem");
const HistoryOnlinePaymentsFactory = require("./history.online.payment.service");

const ORDER_QUERY_TYPE = { ...ORDER_STATUS, ALL: "all" };

class OrdersService {
  static getListOrders = async ({ itemsOfPage = 10, page = 1, userId, type }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    let query = { status: true };
    if (type === ORDER_QUERY_TYPE.ALL) {
      query = { ...query, user: userId };
    } else {
      query = { ...query, user: userId, order_status: type };
    }
    const results = await OrderRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      sort: "-createdAt",
    });

    for (const item of results) {
      const getOrderItems = await OrderItemRepository.findAll({
        query: {
          status: true,
          order_id: item._id,
        },
      });
      item["order_items"] = getOrderItems;
    }

    return results;
  };
  static getDetailedOrder = async ({ orderId, userId }) => {
    const result = await OrderRepository.findOne({
      query: {
        status: true,
        _id: orderId,
        user: userId,
      },
    });
    if (!result) {
      throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
    }
    // get order items
    const listOrderItems = await OrderItemRepository.findAll({
      query: {
        status: true,
        order_id: orderId,
      },
    });

    return { ...result, listOrderItems: listOrderItems };
  };
  static createOrder = async ({ userId, email, note, voucher, address, paymentMethod }) => {
    if (!paymentMethod || !address) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // check payment method is valid
    if (!Object.values(CART_PAYMENT_METHOD).includes(paymentMethod)) {
      throw new UnauthorizedError(ORDER_MESSAGES.PAYMENT_METHOD_IS_NOT_EXISTS);
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const options = { session };
      // Check user has a cart?
      const checkCartIsExists = await CartRepository.findOne({
        query: {
          user: userId,
          status: true,
        },
      });
      if (!checkCartIsExists) {
        throw new BadRequestError(CART_MESSAGES.CART_IS_NOT_EXISTS);
      }

      // PRODUCT
      // Check products
      const getListCartItems = await CartItemRepository.findAll({
        query: {
          status: true,
          cart_id: checkCartIsExists._id,
        },
        populate: [
          {
            path: "data.product",
            populate: "product_color product_sale_event",
          },
          { path: "data.size" },
        ],
      });
      // filter products invalid

      let listCartItems = removeInvalidProducts({
        listCartItems: getListCartItems,
      });

      // Check cart items is empty?
      if (listCartItems.length === 0) {
        throw new BadRequestError(ORDER_MESSAGES.MIN_CART_ITEMS_REQUIRED);
      }

      // Check quantity product and update quantity product
      // using redis locking

      const acquireProduct = [];
      for (let i = 0; i < listCartItems.length; i++) {
        const keyLock = await RedisService.acquireLock({
          productId: listCartItems[i].data.product._id,
          productQuantities: listCartItems[i].data.quantities,
          productSize: listCartItems[i].data.size._id,
          options,
        });

        acquireProduct.push(keyLock ? true : false);
        if (keyLock) {
          await RedisService.releaseLock(keyLock);
        }
      }
      if (acquireProduct.includes(false)) {
        throw new BadRequestError(ORDER_MESSAGES.PRODUCT_ITEMS_RENEW);
      }

      // ADDRESS
      // Check address is valid
      const checkAddressIsExist = await UserAddressesRepository.findOne({
        query: {
          user_id: userId,
          _id: address._id,
          status: true,
        },
      });

      if (!checkAddressIsExist) {
        throw new BadRequestError(USER_MESSAGES.ADDRESS_INVALID);
      }

      // VOUCHER
      let checkVoucherIsExists = null;
      if (voucher) {
        // Check voucher is valid

        checkVoucherIsExists = await checkVoucherApplyIsValid({
          userId,
          voucherId: voucher._id,
          listCartItems,
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

      const newOrder = await OrderRepository.createOne({
        data: {
          order_method: paymentMethod,
          user: userId,
          voucher: voucher
            ? { discount, min_order_quantity, min_order_amount, type, code, description, expired_date, createdAt }
            : undefined,
          address: { provine, district, ward, full_name, phone_number, detail_address },
          note,
          subTotal,
          shippingCost,
          discountAmount,
          total,
        },
        options,
      });

      if (paymentMethod === CART_PAYMENT_METHOD.BANKING) {
        await OrderRepository.findOneAndUpdate({
          query: {
            _id: newOrder._id,
          },
          update: {
            order_status: ORDER_STATUS.PAYMENT_PENDING,
          },
          options,
        });
      }

      // Create order items

      const listCreateOrderItems = listCartItems.map((cartItem) => {
        const { _id, product_images, product_gender, product_original_price, product_name, product_color, product_sale_event } =
          cartItem.data.product;
        const { _id: sizeId, product_size_name } = cartItem.data.size;
        const totalAmount = Math.round(cartItem.data.product.product_original_price * cartItem.data.quantities);

        const newOrderItems = OrderItemRepository.createOne({
          data: {
            order_id: newOrder._id,
            user_id: userId,
            data: {
              product: { _id, product_images, product_gender, product_original_price, product_name, product_color, product_sale_event },
              size: { _id: sizeId, product_size_name },
              quantities: cartItem.data.quantities,
              totalAmount,
            },
          },
          options,
        });

        return newOrderItems;
      });

      await Promise.all(listCreateOrderItems);

      const addressSendEmail = `${full_name}, ${phone_number}, ${detail_address}, ${district}, ${ward}, ${provine}`;
      const listOrdertItemSendEmail = listCartItems.map((cartItem) => {
        const { _id, product_images, product_gender, product_original_price, product_name, product_color, product_sale_event } =
          cartItem.data.product;
        const { _id: sizeId, product_size_name } = cartItem.data.size;
        const totalAmount = Math.round(cartItem.data.product.product_original_price * cartItem.data.quantities);
        return {
          product_image: product_images[0],
          product_name,
          product_quantity: cartItem.data.quantities,
          product_totalAmount: totalAmount,
          product_color: product_color.product_color_name,
          product_size: product_size_name,
        };
      });
      const orderDataSendMail = {
        order_id: newOrder._id,
        order_address: addressSendEmail,
        order_date: newOrder.createdAt,
        sub_total: newOrder.subTotal,
        shipping_cost: newOrder.shippingCost,
        discount_amount: newOrder.discountAmount,
        total: newOrder.total,
        order_note: note,
        listItems: listOrdertItemSendEmail,
      };

      await EmailService.sendEmailCreateOrder({ email, orderData: orderDataSendMail });

      // Delete all cart items
      await CartItemRepository.deleteMany({
        query: {
          cart_id: checkCartIsExists._id,
          user_id: userId,
        },
        options,
      });

      // Update status voucher
      if (voucher) {
        await VoucherRepository.findOneAndUpdate({
          query: {
            user: userId,
            _id: checkVoucherIsExists._id,
          },
          update: {
            status: false,
          },
          options,
        });
      }

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
                const findOrder = await OrderRepository.findOne({ query: { _id: newOrder._id } });
                if (findOrder) {
                  if (findOrder.order_status === ORDER_STATUS.PAYMENT_PENDING) {
                    // Update canceled status order
                    await OrderRepository.findOneAndUpdate({
                      query: {
                        _id: newOrder._id,
                      },
                      update: {
                        order_status: ORDER_STATUS.CANCELLED,
                      },
                      options,
                    });

                    // Restore quantity products

                    const listOrderItems = await OrderItemRepository.findAll({
                      query: {
                        order_id: newOrder._id,
                      },
                    });

                    const listProducts = listOrderItems.map((orderItem) => orderItem.data);

                    const listUpdateQuantityProducts = listProducts.map((item) => {
                      return increseQuantityProduct({
                        productId: item.product,
                        productSize: item.size,
                        productQuantities: item.quantities,
                        options,
                      });
                    });
                    await Promise.all(listUpdateQuantityProducts);
                  }
                }
              });
            } catch (err) {
              throw err;
            } finally {
              session.endSession();
            }
          },
        });
      }

      await session.commitTransaction();
      return newOrder;
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  };

  static cancelOrder = async ({ userId, orderId }) => {
    if (!orderId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const session = await mongoose.startSession();
    const options = { session };
    try {
      await session.withTransaction(async () => {
        try {
          const findOrder = await OrderRepository.findOne({ query: { _id: orderId, user: userId } });
          if (!findOrder) {
            throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
          }
          const listStatusCancelled = [ORDER_STATUS.PAYMENT_PENDING, ORDER_STATUS.PENDING, ORDER_STATUS.DELIVERING];
          if (!listStatusCancelled.includes(findOrder.order_status)) {
            throw new BadRequestError(ORDER_MESSAGES.CANNOT_CANCEL);
          }

          // Update canceled status order

          await OrderRepository.findOneAndUpdate({
            query: {
              _id: orderId,
            },
            update: {
              order_status: ORDER_STATUS.CANCELLED,
            },
            options,
          });

          // Restore quantity products
          const listOrderItems = await OrderItemRepository.findAll({
            query: {
              order_id: orderId,
            },
          });
          const listProducts = listOrderItems.map((orderItem) => orderItem.data);

          const listUpdateQuantityProducts = listProducts.map((item) => {
            return increseQuantityProduct({
              productId: item.product,
              productSize: item.size,
              productQuantities: item.quantities,
              options,
            });
          });
          await Promise.all(listUpdateQuantityProducts);
          await session.commitTransaction();
        } catch (err) {
          await session.abortTransaction();
          throw err;
        }
      });
    } catch (err) {
      throw err;
    } finally {
      session.endSession();
    }
  };

  static checkVNPay = async ({ vnp_Params }) => {
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
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    let secureHash = vnp_SecureHash;
    let tmnCode = process.env.VNPAY_TMNCODE || "";
    let secretKey = process.env.VNPAY_HASHSECRET || "";
    vnp_Params["vnp_SecureHash"] = undefined;
    let signData = QueryString.stringify(vnp_Params, { encode: false });
    let signed = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);

    if (secureHash !== signed) {
      throw new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_ERROR);
    }
    const checkOrderExist = await OrderRepository.findOne({ query: { _id: vnp_TxnRef } });
    if (!checkOrderExist) {
      throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
    }
    vnp_Amount = (vnp_Amount * 1) / 100;
    if (checkOrderExist.total !== vnp_Amount) {
      throw new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_AMOUNT_INVALID);
    }
    if (checkOrderExist.order_status !== ORDER_STATUS.PAYMENT_PENDING) {
      throw new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_ALREADY);
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
      throw new BadRequestError(ORDER_MESSAGES.ONLINE_PAYMENT_ERROR);
    }
    await OrderRepository.findOneAndUpdate({
      query: {
        _id: checkOrderExist._id,
      },
      update: {
        order_status: ORDER_STATUS.PENDING,
      },
    });
  };

  ////
}
module.exports = OrdersService;
