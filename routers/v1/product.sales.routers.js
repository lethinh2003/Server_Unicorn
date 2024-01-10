const express = require("express");
const productSalesController = require("../../controllers/product.sales.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

router.route("/").post(authController.protect, authController.reStrictTo(["admin"]), productSalesController.createSaleEvent);

module.exports = router;
