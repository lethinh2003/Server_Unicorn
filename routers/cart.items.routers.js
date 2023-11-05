const express = require("express");
const cartItemsController = require("../controllers/cart.items.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /carts/cart-items/get-all:
 *   get:
 *     tags:
 *       - Cart Item
 *     summary: Lấy thông tin tất cả sản phẩm trong giỏ hàng
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
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/get-all").get(authController.protect, cartItemsController.getAllUserCartItems);
/**
 * @swagger
 * /carts/cart-items:
 *   post:
 *     tags:
 *       - Cart Item
 *     summary: Thêm sản phẩm vào trong giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "65118f075700f56d346034ef" 
 *               productQuantities:
 *                 type: integer
 *                 example: 1 
 *               productSize:
 *                 type: string
 *                 example: "650ea84a828567aff85ca68f" 
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
 *                   example: "Thêm sản phẩm vào giỏ hàng thành công"
 *                 data:
 *                   type: object
 *                   example: {}

 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/").post(authController.protect, cartItemsController.createCartItem);
/**
 * @swagger
 * /carts/cart-items/update-quantities:
 *   post:
 *     tags:
 *       - Cart Item
 *     summary: Cập nhật số lượng của sản phẩm trong giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 example: "65118f075700f56d346034ef" 
 *               productQuantitiesUpdate:
 *                 type: integer
 *                 example: 1 
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
 *                   example: "Cập nhật số lượng thành công"
 *                 data:
 *                   type: object
 *                   example: {}

 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/update-quantities").post(authController.protect, cartItemsController.updateQuantitiesCartItem);

/**
 * @swagger
 * /carts/cart-items/delete:
 *   post:
 *     tags:
 *       - Cart Item
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 example: "65118f075700f56d346034ef" 
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
 *                   example: "Xóa sản phẩm khỏi giỏ hàng thành công"
 *                 data:
 *                   type: object
 *                   example: {}

 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/delete").post(authController.protect, cartItemsController.deleteCartItem);

module.exports = router;
