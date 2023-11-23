const express = require("express");
const adminsController = require("../controllers/admins.controller");
const authController = require("../controllers/auth.controller");
const userAddressRouters = require("./user.addresses.routers");
const router = express.Router();

router.route("/:userId").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getDetailUser);
router.route("/delete").post(authController.protect, authController.reStrictTo(["admin"]), adminsController.deleteUser);
router.route("/update").post(authController.protect, authController.reStrictTo(["admin"]), adminsController.updateUser);
router.route("/").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getUsers);
router.route("/").post(authController.protect, authController.reStrictTo(["admin"]), adminsController.createUser);

module.exports = router;
