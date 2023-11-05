const express = require("express");
const productCategoriesController = require("../controllers/product.categories.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
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
/**
 * @swagger
 * /product-categories:
 *   post:
 *     tags:
 *       - Product Category
 *     summary: Tạo danh mục sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentCategoryId:
 *                 type: string
 *                 example: null
 *               name:
 *                 type: string
 *                 example: "Đồ bầu"
 *               keyword:
 *                 type: string
 *                 example: "maternity"
 *               gender:
 *                 type: string
 *                 example: "women"
 *     responses:
 *       '201':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 status:
 *                   type: string
 *                   example: "Created"
 *                 message:
 *                   type: string
 *                   example: "Created"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").post(authController.protect, authController.reStrictTo(["admin"]), productCategoriesController.createCategory);

module.exports = router;
