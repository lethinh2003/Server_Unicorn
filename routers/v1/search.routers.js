const express = require("express");
const searchController = require("../../controllers/search.controller");

const router = express.Router();

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Danh sách tìm kiếm sản phẩm
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         example: "áo thun"
 *         description: "Từ khóa tìm kiếm"
 *     responses:
 *       '200':
 *         description: Thành công
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
 *                         example: "652f40adb85bcb0ba090663c"
 *                         description: ID của sản phẩm
 *                       product_gender:
 *                         type: string
 *                         example: "men"
 *                         description: Giới tính của sản phẩm
 *                       product_original_price:
 *                         type: number
 *                         example: 391000
 *                         description: Giá gốc của sản phẩm
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của sản phẩm
 *                       parent_product_id:
 *                         type: string
 *                         example: null
 *                         description: ID sản phẩm cha (nếu có)
 *                       product_name:
 *                         type: string
 *                         example: "ÁO THUN TAY LỠ"
 *                         description: Tên của sản phẩm
 *                       product_color:
 *                         type: string
 *                         example: "650eb146b30a24284036eae1"
 *                         description: ID màu sắc của sản phẩm
 *                       createdAt:
 *                         type: string
 *                         example: "2023-10-18T02:19:25.780Z"
 *                         description: Thời gian tạo sản phẩm
 *                       updatedAt:
 *                         type: string
 *                         example: "2023-12-23T15:08:34.736Z"
 *                         description: Thời gian cập nhật sản phẩm
 *                       score:
 *                         type: number
 *                         example: 1.25
 *                         description: Điểm đánh giá của sản phẩm
 *                     description: Thông tin về mỗi sản phẩm trong danh sách
 *                   description: Danh sách sản phẩm
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                       example: "áo thun"
 *                       description: Từ khóa tìm kiếm
 *                     results:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng kết quả trả về
 *                   description: Thông tin về metadata

 */
router.route("/").get(searchController.searchProduct);

module.exports = router;
