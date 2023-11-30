const express = require("express");
const vnpayController = require("../controllers/vnpay.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(vnpayController.checkIPNVNPay);

module.exports = router;
