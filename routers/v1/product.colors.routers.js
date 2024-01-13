const express = require("express");
const productColorsController = require("../../controllers/product.colors.controller");

const router = express.Router();
/**
 * @swagger
 * /product-colors:
 *   get:
 *     tags:
 *       - Products
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       product_color_name:
 *                         type: string
 *                       product_color_code:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                         description: Trạng thái của size sản phẩm
 *                     example:
 *                       - _id: "650eb01246193f4ddcf7862c"
 *                         product_color_name: "Trắng"
 *                         product_color_code: "#fff"
 *                         status: true
 *                         createdAt: "2023-09-23T09:29:54.327Z"
 *                         updatedAt: "2023-09-23T09:29:54.327Z"
 *                       - _id: "650eb0d6b30a24284036ead1"
 *                         product_color_name: "Xám"
 *                         product_color_code: "#dedede"
 *                         status: true
 *                         createdAt: "2023-09-23T09:29:54.327Z"
 *                         updatedAt: "2023-09-23T09:29:54.327Z"

 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */
router.route("/").get(productColorsController.getAllColors);

module.exports = router;
