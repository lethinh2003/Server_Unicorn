const express = require("express");
const userAddressesController = require("../controllers/user.addresses.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, userAddressesController.getUserAddresses);
router.route("/").post(authController.protect, userAddressesController.createAddress);
router.route("/update").post(authController.protect, userAddressesController.updateAddress);
router.route("/delete").post(authController.protect, userAddressesController.deleteAddress);

module.exports = router;
