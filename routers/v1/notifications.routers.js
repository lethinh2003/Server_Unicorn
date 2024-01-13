const express = require("express");
const notificationsController = require("../../controllers/notifications.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Lấy danh sách thông báo
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
 *                         example: "659e475e63c3085a0c5ad861"
 *                         description: ID của dữ liệu
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của dữ liệu
 *                       is_viewed:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái đã xem hay chưa
 *                       receive_id:
 *                         type: string
 *                         example: "650d3f4f421ed24dc41454bb"
 *                         description: ID người nhận thông báo
 *                       type:
 *                         type: string
 *                         example: "discount"
 *                         description: discount || order
 *                       title:
 *                         type: string
 *                         example: "Bạn nhận được voucher mới"
 *                         description: Tiêu đề thông báo
 *                       content:
 *                         type: string
 *                         example: "Bạn nhận được voucher giảm 100%"
 *                         description: Nội dung thông báo
 *                       image:
 *                         type: string
 *                         format: uri
 *                         example: "https://i.imgur.com/ELDMrfv.png"
 *                         description: Đường dẫn hình ảnh của thông báo
 *                       options:
 *                         type: object
 *                         properties:
 *                           voucherCode:
 *                             type: string
 *                             example: "UGLQBAYG1J8FGSB"
 *                             description: Mã voucher (nếu có)
 *                         description: Các tùy chọn khác của thông báo
 *                       createdAt:
 *                         type: string
 *                         example: "2024-01-10T07:29:34.364Z"
 *                         description: Thời gian tạo thông báo
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-10T07:29:46.036Z"
 *                         description: Thời gian cập nhật thông báo
 *                     description: Thông tin về mỗi thông báo trong danh sách
 *                   description: Danh sách thông báo
 *                 metadata:
 *                   type: object
 *                   properties:
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
 *                     results:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng kết quả trả về
 *                   description: Thông tin về metadata
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").get(authController.protect, notificationsController.getNotifications);

/**
 * @swagger
 * /notifications/get-nums-notifications-unread:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Lấy số lượng thông báo chưa đọc
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
 *                   type: number
 *                   example: 1
 *                   description: Số lượng thông báo chưa đọc
 *                 metadata:
 *                   type: object
 *                   example: {}

 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/get-nums-notifications-unread").get(authController.protect, notificationsController.getNumberNotificationsUnRead);

/**
 * @swagger
 * /notifications/update-notifications-unread:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Update trạng thái đã đọc cho các thông báo chưa đọc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                   type: number
 *                   example: 0
 *                 metadata:
 *                   type: object
 *                   example: {}

 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/update-notifications-unread").post(authController.protect, notificationsController.updateNotificationsUnRead);

module.exports = router;
