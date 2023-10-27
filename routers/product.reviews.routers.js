const express = require("express");
const productReviewsController = require("../controllers/product.reviews.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(productReviewsController.getReviewsByProduct);
router.route("/rating-overview").get(productReviewsController.getRatingOverviewByProduct);
router.route("/").post(authController.protect, productReviewsController.createReview);

module.exports = router;
