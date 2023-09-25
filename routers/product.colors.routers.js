const express = require("express");
const productColorsController = require("../controllers/product.colors.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(productColorsController.getAllColors);
router.route("/").post(productColorsController.createColor);

module.exports = router;
