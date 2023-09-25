const express = require("express");
const productSizesController = require("../controllers/product.sizes.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(productSizesController.getAllSizes);

module.exports = router;
