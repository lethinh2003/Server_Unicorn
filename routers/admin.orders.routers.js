const express = require("express");
const adminsController = require("../controllers/admins.controller");
const authController = require("../controllers/auth.controller");
const userAddressRouters = require("./user.addresses.routers");
const router = express.Router();

router.route("/:orderId").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getDetailedOrder);
router.route("/delete").post(authController.protect, authController.reStrictTo(["admin"]), adminsController.deleteOrder);
router.route("/update").post(authController.protect, authController.reStrictTo(["admin"]), adminsController.updateOrder);
router.route("/").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getOrders);

module.exports = router;
