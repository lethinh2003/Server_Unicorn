const express = require("express");
const adminsController = require("../controllers/admins.controller");
const authController = require("../controllers/auth.controller");
const userAddressRouters = require("./user.addresses.routers");
const router = express.Router();

router.route("/").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getUsers);

module.exports = router;
