const express = require("express");
const productSalesController = require("../controllers/product.sales.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.route("/").post(productSalesController.createSaleEvent);

module.exports = router;
