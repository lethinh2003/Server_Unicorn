const express = require("express");
const ordersController = require("../controllers/orders.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").post(authController.protect, ordersController.createOrder);

module.exports = router;
