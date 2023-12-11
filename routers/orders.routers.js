const express = require("express");
const ordersController = require("../controllers/orders.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, ordersController.getListOrders);
router.route("/").post(authController.protect, ordersController.createOrder);
router.route("/cancel").post(authController.protect, ordersController.cancelOrder);
router.route("/:orderId").get(authController.protect, ordersController.getDetailedOrder);
router.route("/vnpay_ipn").post(authController.protect, ordersController.checkVNPay);

module.exports = router;
