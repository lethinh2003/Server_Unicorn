const express = require("express");
const favoriteProductsController = require("../controllers/favorite.products.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /favorite-products:
 *   get:
 *     tags:
 *       - Favorite Products
 *     summary: Lấy danh sách sản phẩm yêu thích
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
 *                   example: []
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     userId:
 *                       type: string
 *                     results:
 *                       type: integer
 *                   example:
 *                     page: 1
 *                     limit: 10
 *                     userId: "650d3f4f421ed24dc41454bb"
 *                     results: 0
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").get(authController.protect, favoriteProductsController.getFavoriteProducts);

/**
 * @swagger
 * /favorite-products:
 *   post:
 *     tags:
 *       - Favorite Products
 *     summary: Thêm vào sản phẩm yêu thích
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "652296b4e5c044256403216e"
 *     responses:
 *       '201':
 *         description: Thành công
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
 *                   example: "Thêm vào danh sách yêu thích thành công"
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
router.route("/").post(authController.protect, favoriteProductsController.createFavoriteProduct);

/**
 * @swagger
 * /favorite-products/get-all:
 *   get:
 *     tags:
 *       - Favorite Products
 *     summary: Lấy tất cả danh sách sản phẩm yêu thích theo Product ID
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
 *                         example: "653dde5fe226455794c8150e"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     results:
 *                       type: integer
 *                   example:
 *                     userId: "650d3f4f421ed24dc41454bb"
 *                     results: 1
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/get-all").get(authController.protect, favoriteProductsController.getAllFavoriteProducts);

/**
 * @swagger
 * /favorite-products/unlike:
 *   post:
 *     tags:
 *       - Favorite Products
 *     summary: Xóa khỏi sản phẩm yêu thích
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "652296b4e5c044256403216e"
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
 *                   example: "Xóa khỏi danh sách yêu thích thành công"
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
router.route("/unlike").post(authController.protect, favoriteProductsController.removeFavoriteProduct);

/**
 * @swagger
 * /favorite-products/check-is-exist:
 *   post:
 *     tags:
 *       - Favorite Products
 *     summary: Kiểm tra sản phẩm đã có trong sản phẩm yêu thích hay chưa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "652296b4e5c044256403216e"
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
 *                   type: boolean
 *                   example: false
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/check-is-exist").post(authController.protect, favoriteProductsController.checkExistFavoriteProduct);

module.exports = router;
