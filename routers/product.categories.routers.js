const express = require("express");
const productCategoriesController = require("../controllers/product.categories.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
router.route("/").get(productCategoriesController.getAllCategoriesByGender);
router.route("/list-child").get(productCategoriesController.getChildCategories);
router.route("/").post(productCategoriesController.createCategory);

module.exports = router;
