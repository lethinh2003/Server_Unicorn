const express = require("express");
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// User Addresses Routers
router.use("/users", require("./admin.users.routers"));
router.use("/orders", require("./admin.orders.routers"));

module.exports = router;
