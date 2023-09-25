const express = require("express");
const productsController = require("../controllers/products.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(productsController.getAllParentProducts);
router.route("/").post(productsController.createProduct);

module.exports = router;
