const express = require("express");
const cartItemsController = require("../controllers/cart.items.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, cartItemsController.getUserCartItems);
router.route("/get-all").get(authController.protect, cartItemsController.getAllUserCartItems);
router.route("/").post(authController.protect, cartItemsController.createCartItem);
router.route("/update-quantities").post(authController.protect, cartItemsController.updateQuantitiesCartItem);
router.route("/delete").post(authController.protect, cartItemsController.deleteCartItem);

module.exports = router;
