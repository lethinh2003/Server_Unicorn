const express = require("express");
const vouchersController = require("../controllers/vouchers.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, vouchersController.getUserVouchers);
router.route("/").post(authController.protect, authController.reStrictTo(["admin"]), vouchersController.createVoucher);

module.exports = router;
