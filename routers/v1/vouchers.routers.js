const express = require("express");
const vouchersController = require("../../controllers/vouchers.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

/**
 * @swagger
 * /vouchers:
 *   get:
 *     tags:
 *       - Vouchers
 *     summary: Lấy danh sách voucher
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         default: 1
 *       - in: query
 *         name: itemsOfPage
 *         schema:
 *           type: integer
 *         required: true
 *         default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         default: ""
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
 *                         example: "659c12fe339b836440d7b1aa"
 *                         description: ID của mã giảm giá
 *                       discount:
 *                         type: number
 *                         example: 100
 *                         description: Giá trị giảm giá
 *                       min_order_quantity:
 *                         type: integer
 *                         example: 0
 *                         description: Số lượng sản phẩm tối thiểu để áp dụng mã
 *                       min_order_amount:
 *                         type: number
 *                         example: 0
 *                         description: Giá trị đơn hàng tối thiểu để áp dụng mã
 *                       type:
 *                         type: string
 *                         example: "amount"
 *                         description: Loại giảm giá ("amount" hoặc "free_ship")
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của mã giảm giá
 *                       user:
 *                         type: string
 *                         example: "650d3f4f421ed24dc41454bb"
 *                         description: ID người dùng
 *                       code:
 *                         type: string
 *                         example: "JAFOROZ3G5STYFT"
 *                         description: Mã giảm giá
 *                       description:
 *                         type: string
 *                         example: "Giảm 100% tổng tiền"
 *                         description: Mô tả về mã giảm giá
 *                       expired_date:
 *                         type: string
 *                         example: "2024-01-17T17:00:00.000Z"
 *                         description: Thời gian hết hạn của mã giảm giá
 *                       createdAt:
 *                         type: string
 *                         example: "2024-01-08T15:21:34.118Z"
 *                         description: Thời gian tạo mã giảm giá
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-08T15:21:34.118Z"
 *                         description: Thời gian cập nhật mã giảm giá
 *                     description: Thông tin về mỗi mã giảm giá trong danh sách
 *                   description: Danh sách mã giảm giá
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     countAll:
 *                       type: integer
 *                       example: 2
 *                       description: Tổng số lượng mã giảm giá
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Trang hiện tại
 *                     limit:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng dữ liệu trên mỗi trang
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng
 *                     search:
 *                       type: string
 *                       example: ""
 *                       description: Từ khóa tìm kiếm (nếu có)
 *                     results:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng kết quả trả về
 *                   description: Thông tin về metadata
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").get(authController.protect, vouchersController.getUserVouchers);

module.exports = router;
