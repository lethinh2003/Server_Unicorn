"use strict";

const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const VouchersService = require("../services/vouchers.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const {
  pagination: {
    limitItems: { voucher: LIMIT_ITEMS },
  },
} = require("../configs/config.pagination");
const UsersService = require("../services/users.service");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const Fuse = require("fuse.js");
const NotificationsService = require("../services/notifications.service");

class NotificationsController {
  getNotifications = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;

    const limitItems = itemsOfPage * 1 || LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await NotificationsService.findNotifications({
      userId,
      limitItems,
      skipItems,
    });

    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        userId,
        results: results.length,
      },
    }).send(res);
  });
  getNumberNotificationsUnRead = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const results = await NotificationsService.countNotificationsUnRead({
      userId,
    });

    return new OkResponse({
      data: results,
    }).send(res);
  });
  updateNotificationsUnRead = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const results = await NotificationsService.updateNotificationsUnRead({
      userId,
    });

    return new OkResponse({
      data: 0,
    }).send(res);
  });
}

module.exports = new NotificationsController();
