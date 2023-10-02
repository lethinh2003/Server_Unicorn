const express = require("express");
const cartsController = require("../controllers/carts.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, cartsController.getUserCart);
router.route("/").post(authController.protect, cartsController.createCart);
router.route("/add-product").post(authController.protect, cartsController.addProduct);

module.exports = router;
