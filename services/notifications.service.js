"use strict";

const Notifications = require("../models/Notifications");
const NotificationRepository = require("../models/repositories/notification.repository");
const { BadRequestError } = require("../utils/app_error");

class NotificationsService {
  static getNotifications = async ({ userId, itemsOfPage = 10, page = 1 }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    const results = await NotificationRepository.find({
      query: {
        receive_id: userId,
        status: true,
      },
      skip: skipItems,
      limit: limitItems,
      sort: "-createdAt",
    });
    return { results, limitItems, currentPage };
  };
  static getNumberNotificationsUnRead = async ({ userId }) => {
    const result = await NotificationRepository.countDocuments({
      query: {
        receive_id: userId,
        is_viewed: false,
        status: true,
      },
    });
    return result;
  };

  static updateNotificationsUnRead = async ({ userId }) => {
    const result = await NotificationRepository.updateMany({
      query: {
        receive_id: userId,
        is_viewed: false,
        status: true,
      },
      update: {
        is_viewed: true,
      },
    });
    return result;
  };
  ////
}
module.exports = NotificationsService;
