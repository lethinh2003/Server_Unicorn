const express = require("express");
const productSizesController = require("../../controllers/product.sizes.controller");

const router = express.Router();
/**
 * @swagger
 * /product-sizes:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy thông tin tất cả size của sản phẩm
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
 *                         example: "650ea87a828567aff85ca690"
 *                         description: ID của size sản phẩm
 *                       product_size_name:
 *                         type: string
 *                         example: "S"
 *                         description: Tên của size sản phẩm
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của size sản phẩm
 *                     example:
 *                       - _id: "650ea87a828567aff85ca690"
 *                         product_size_name: "S"
 *                         status: true
 *                       - _id: "650ea88a828567aff85ca691"
 *                         product_size_name: "M"
 *                         status: true
 *                   description: Danh sách các size của sản phẩm
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */
router.route("/").get(productSizesController.getAllSizes);

module.exports = router;
