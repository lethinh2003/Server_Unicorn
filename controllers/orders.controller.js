"use strict";

const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { ORDER_STATUS } = require("../configs/config.orders");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const OrdersService = require("../services/orders.service");

const ORDER_QUERY_TYPE = { ...ORDER_STATUS, ALL: "all" };

class OrdersController {
  getDetailedOrder = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { orderId } = req.params;

    return new OkResponse({
      data: await OrdersService.getDetailedOrder({
        orderId,
        userId,
      }),
    }).send(res);
  });

  getListOrders = catchAsync(async (req, res, next) => {
    const { itemsOfPage = 10, page = 1, type = ORDER_QUERY_TYPE.ALL } = req.query;
    const { _id: userId } = req.user;
    const results = await OrdersService.getListOrders({
      itemsOfPage,
      page,
      type,
      userId,
    });

    return new OkResponse({
      data: results,
      metadata: {
        ...req.query,
        page: page * 1,
        limit: itemsOfPage * 1,
        results: results.length,
      },
    }).send(res);
  });

  cancelOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.body;
    const { _id: userId } = req.user;

    await OrdersService.cancelOrder({
      userId,
      orderId,
    });

    return new OkResponse({
      message: ORDER_MESSAGES.CANCEL_ORDER_SUCCESS,
      metadata: { ...req.body },
    }).send(res);
  });

  createOrder = catchAsync(async (req, res, next) => {
    const { _id: userId, email } = req.user;
    const { note, voucher, address, paymentMethod } = req.body;

    return new CreatedResponse({
      data: await OrdersService.createOrder({
        userId,
        email,
        note,
        voucher,
        address,
        paymentMethod,
      }),
      message: ORDER_MESSAGES.CREATE_ORDER_SUCCESS,
    }).send(res);
  });
  checkVNPay = catchAsync(async (req, res, next) => {
    const { vnp_Params } = req.body;

    await OrdersService.checkVNPay({ vnp_Params });
    return new OkResponse({
      message: ORDER_MESSAGES.ONLINE_PAYMENT_SUCCESS,
    }).send(res);
  });
}

module.exports = new OrdersController();
