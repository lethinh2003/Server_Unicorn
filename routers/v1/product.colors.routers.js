const express = require("express");
const productColorsController = require("../../controllers/product.colors.controller");

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

module.exports = router;
