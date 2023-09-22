const express = require("express");
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/login").post(usersController.loginUser);
router.route("/refresh-token").post(usersController.handleRefreshToken);
router.route("/logout").post(authController.protect, usersController.logoutUser);
router.route("/").post(usersController.createUser);
router.route("/send-reset-password-otp").post(usersController.sendResetPasswordOTP);
router.route("/reset-password").post(usersController.resetPassword);

module.exports = router;
