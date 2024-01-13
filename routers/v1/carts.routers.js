const express = require("express");
const cartsController = require("../../controllers/carts.controller");
const cartItemsRouter = require("./cart.items.routers");
const authController = require("../../controllers/auth.controller");

const router = express.Router();
// router.route("/").get(authController.protect, cartsController.getUserCart);

/**
 * @swagger
 * /carts/check-voucher:
 *   post:
 *     tags:
 *       - Carts
 *     summary: Kiểm tra voucher có hợp lệ để áp dụng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucherId:
 *                 type: string
 *                 example: "659c12fe339b836440d7b1aa"
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
 *                   type: boolean
 *                   example: true
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     voucherId:
 *                       type: string
 *                       example: "659c12fe339b836440d7b1aa"
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng
 *                   description: Thông tin về metadata
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/check-voucher").post(authController.protect, cartsController.checkVoucher);
router.use("/cart-items", cartItemsRouter);
module.exports = router;
