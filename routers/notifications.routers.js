const express = require("express");
const notificationsController = require("../controllers/notifications.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, notificationsController.getNotifications);
router.route("/get-nums-notifications-unread").get(authController.protect, notificationsController.getNumberNotificationsUnRead);
router.route("/update-notifications-unread").post(authController.protect, notificationsController.updateNotificationsUnRead);

module.exports = router;
