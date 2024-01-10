const express = require("express");
const adminsController = require("../../controllers/admins.controller");
const authController = require("../../controllers/auth.controller");
const router = express.Router();

router.route("/:categoryId").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getDetailedCategory);
router.route("/").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getCategories);
router.route("/update").post(authController.protect, authController.reStrictTo(["admin"]), adminsController.updateCategory);

module.exports = router;
