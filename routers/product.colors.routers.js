const express = require("express");
const productColorsController = require("../controllers/product.colors.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /product-colors:
 *   get:
 *     tags:
 *       - Product Color
 *     summary: Lấy thông tin tất cả màu của sản phẩm
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
router.route("/").get(productColorsController.getAllColors);
/**
 * @swagger
 * /product-colors:
 *   post:
 *     tags:
 *       - Product Color
 *     summary: Tạo màu sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Be"
 *               code:
 *                 type: string
 *                 example: "#d7b694"
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
router.route("/").post(authController.protect, authController.reStrictTo(["admin"]), productColorsController.createColor);

module.exports = router;
