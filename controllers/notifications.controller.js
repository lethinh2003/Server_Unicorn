"use strict";

const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const NotificationsService = require("../services/notifications.service");

class NotificationsController {
  getNotifications = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;
    const { _id: userId } = req.user;
    const { results, currentPage, limitItems } = await NotificationsService.getNotifications({
      userId,
      itemsOfPage,
      page,
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
    const results = await NotificationsService.getNumberNotificationsUnRead({
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
