const express = require("express");
const cartsController = require("../controllers/carts.controller");
const cartItemsRouter = require("../routers/cart.items.routers");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.use("/cart-items", cartItemsRouter);
module.exports = router;
