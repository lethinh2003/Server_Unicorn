const express = require("express");
const productsController = require("../controllers/products.controller");
const authController = require("../controllers/auth.controller");
const productReviewsRouters = require("../routers/product.reviews.routers");

const router = express.Router();
router.route("/").get(productsController.getAllParentProducts);
router.route("/").post(authController.protect, authController.reStrictTo("admin"), productsController.createProduct);
router.route("/latest-collection").get(productsController.getLatestProducts);
router.route("/suggesting").get(productsController.getSuggestProducts);
// Product review router
router.use("/reviews", productReviewsRouters);

router.route("/:productId").get(productsController.getDetailProduct);

module.exports = router;
