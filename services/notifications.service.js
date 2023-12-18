"use strict";
const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const Notifications = require("../models/Notifications");
const Vouchers = require("../models/Vouchers");
const { BadRequestError } = require("../utils/app_error");

class NotificationsService {
  static findNotifications = async ({ userId, limitItems, skipItems }) => {
    let results = [];
    results = await Notifications.find({
      receive_id: userId,
      status: true,
    })
      .skip(skipItems)
      .limit(limitItems)
      .sort("-createdAt")
      .lean();

    return results;
  };
  static countNotificationsUnRead = async ({ userId }) => {
    const result = await Notifications.countDocuments({
      receive_id: userId,
      is_viewed: false,
    });
    return result;
  };
  static updateNotificationsUnRead = async ({ userId }) => {
    const result = await Notifications.updateMany({
      receive_id: userId,
      is_viewed: false,
    }, {
      is_viewed: true
    });
    return result;
  };

  static createNotification = async ({ receiveId, type, title, image, content, options = {} }) => {
    const result = await Notifications.create({
      receive_id: receiveId,
      type,
      title,
      image,
      content,
      options,
    });
    return result;
  };
}
module.exports = NotificationsService;
