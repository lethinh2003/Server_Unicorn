const express = require("express");
const favoriteProductsController = require("../controllers/favorite.products.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(authController.protect, favoriteProductsController.getFavoriteProducts);
router.route("/").post(authController.protect, favoriteProductsController.createFavoriteProduct);

module.exports = router;
