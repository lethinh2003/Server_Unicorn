const express = require("express");
const adminsController = require("../../controllers/admins.controller");
const authController = require("../../controllers/auth.controller");
const router = express.Router();

router.route("/").get(authController.protect, authController.reStrictTo("admin"), adminsController.getAllProducts);
router.route("/parents").get(authController.protect, authController.reStrictTo("admin"), adminsController.getAllParentProductsByGender);
router.route("/sale-events").get(authController.protect, authController.reStrictTo("admin"), adminsController.getProductSaleEvents);
router.route("/:productId").get(authController.protect, authController.reStrictTo(["admin"]), adminsController.getDetailedProduct);
router.route("/").post(authController.protect, authController.reStrictTo("admin"), adminsController.createProduct);
router.route("/update").post(authController.protect, authController.reStrictTo("admin"), adminsController.updateProduct);
router.route("/delete").post(authController.protect, authController.reStrictTo("admin"), adminsController.deleteProduct);

module.exports = router;
