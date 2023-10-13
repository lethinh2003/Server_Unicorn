const express = require("express");
const productsController = require("../controllers/products.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(productsController.getAllParentProducts);
router.route("/latest-collection").get(productsController.getLatestProducts);
router.route("/:productId").get(productsController.getDetailProduct);
router.route("/").post(productsController.createProduct);

module.exports = router;
