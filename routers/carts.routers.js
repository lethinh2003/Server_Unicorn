const express = require("express");
const cartsController = require("../controllers/carts.controller");
const cartItemsRouter = require("../routers/cart.items.routers");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, cartsController.getUserCart);
router.route("/check-voucher").post(authController.protect, cartsController.checkVoucher);
router.use("/cart-items", cartItemsRouter);
module.exports = router;
