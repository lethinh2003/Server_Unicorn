const express = require("express");
const adminsController = require("../controllers/admins.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// User Addresses Routers
router.route("/overview").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getOverview);
router.route("/weekly-revenue").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getWeeklyRevenue);
router.route("/monthly-revenue").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getMonthlyRevenue);

router.use("/users", require("./admin.users.routers"));
router.use("/orders", require("./admin.orders.routers"));
router.use("/products", require("./admin.products.routers"));
router.use("/vouchers", require("./admin.vouchers.routers"));

module.exports = router;
