const express = require("express");
const productSizesController = require("../controllers/product.sizes.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /product-sizes:
 *   get:
 *     tags:
 *       - Product Size
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
 *                   type: object
 *                   example: {}
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */
router.route("/").get(productSizesController.getAllSizes);

module.exports = router;
