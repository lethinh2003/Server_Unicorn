const express = require("express");
const productCategoriesController = require("../../controllers/product.categories.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

router.route("/parents").get(productCategoriesController.getAllParentCategoriesByGender);

/**
 * @swagger
 * /product-categories:
 *   get:
 *     tags:
 *       - Product Category
 *     summary: Lấy thông tin tất cả danh mục sản phẩm
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         required: true
 *         default: "men"
 *         description: "Loại đồ: men || women"
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */
router.route("/").get(productCategoriesController.getAllCategoriesByGender);

router.route("/list-child").get(productCategoriesController.getChildCategories);

module.exports = router;
