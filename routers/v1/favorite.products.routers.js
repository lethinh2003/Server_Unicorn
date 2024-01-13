const express = require("express");
const favoriteProductsController = require("../../controllers/favorite.products.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /favorite-products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy danh sách sản phẩm yêu thích của user
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
 *                         example: "659f6117b2dd415eb0d8b17b"
 *                         description: ID của dữ liệu
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của dữ liệu
 *                       user:
 *                         type: string
 *                         example: "650d3f4f421ed24dc41454bb"
 *                         description: ID người dùng
 *                       product_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "65462be3f259735ee80b96b8"
 *                             description: ID sản phẩm
 *                           product_images:
 *                             type: array
 *                             items:
 *                               type: string
 *                               format: uri
 *                               example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/465929/item/vngoods_03_465929.jpg?width=750"
 *                               description: Đường dẫn ảnh của sản phẩm
 *                             description: Mảng các đường dẫn ảnh sản phẩm
 *                           product_gender:
 *                             type: string
 *                             example: "men"
 *                             description: Giới tính của sản phẩm
 *                           product_original_price:
 *                             type: number
 *                             example: 1588000
 *                             description: Giá gốc của sản phẩm
 *                           status:
 *                             type: boolean
 *                             example: true
 *                             description: Trạng thái của sản phẩm
 *                           parent_product_id:
 *                             type: string
 *                             example: "65462bcdf259735ee80b96ae"
 *                             description: ID sản phẩm cha (nếu có)
 *                           product_name:
 *                             type: string
 *                             example: "Áo Thun Co Giãn Giả Lông Cừu In Họa Tiết Cổ 3 Phân"
 *                             description: Tên của sản phẩm
 *                           product_color:
 *                             type: object
 *                             properties:
 *                               product_color_name:
 *                                 type: string
 *                                 example: "Xám"
 *                                 description: Tên màu của sản phẩm
 *                               product_color_code:
 *                                 type: string
 *                                 example: "#dedede"
 *                                 description: Mã màu của sản phẩm
 *                             description: Thông tin về màu sắc của sản phẩm
 *                           createdAt:
 *                             type: string
 *                             example: "2023-11-04T11:32:51.854Z"
 *                             description: Thời gian tạo sản phẩm
 *                           updatedAt:
 *                             type: string
 *                             example: "2023-11-04T11:32:51.854Z"
 *                             description: Thời gian cập nhật sản phẩm
 *                         description: Thông tin về sản phẩm
 *                       createdAt:
 *                         type: string
 *                         example: "2024-01-11T03:31:35.970Z"
 *                         description: Thời gian tạo dữ liệu
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-11T03:31:35.970Z"
 *                         description: Thời gian cập nhật dữ liệu
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Trang hiện tại
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Số lượng dữ liệu trên mỗi trang
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng
 *                     results:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng kết quả trả về
 *                     countAll:
 *                       type: integer
 *                       example: 2
 *                       description: Tổng số lượng dữ liệu
 *                   description: Thông tin về metadata
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
 *       - Products
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
 *                 example: "65462be3f259735ee80b96b8"
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
 *                   properties:
 *                     status:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái của dữ liệu
 *                     _id:
 *                       type: string
 *                       example: "65a201ee82814824c07e9a70"
 *                       description: ID của dữ liệu
 *                     user:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng
 *                     product_id:
 *                       type: string
 *                       example: "65462be3f259735ee80b96b8"
 *                       description: ID sản phẩm
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-13T03:22:22.212Z"
 *                       description: Thời gian tạo dữ liệu
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-01-13T03:22:22.212Z"
 *                       description: Thời gian cập nhật dữ liệu
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                       description: Phiên bản của dữ liệu
 *                   description: Dữ liệu chi tiết của item được tạo mới
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65462be3f259735ee80b96b8"
 *                       description: ID sản phẩm liên quan
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng liên quan
 *                   description: Thông tin về metadata
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
 *       - Products
 *     summary: Lấy tất cả danh sách sản phẩm yêu thích
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
 *       - Products
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
 *                   type: null
 *                   description: Dữ liệu được trả về (null vì không có dữ liệu được trả về)
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65462be3f259735ee80b96b8"
 *                       description: ID sản phẩm liên quan
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng liên quan
 *                   description: Thông tin về metadata
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
 *       - Products
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
 *                   description: true (đã tồn tại) || false (chưa có)
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "652296b4e5c044256403216e"
 *                       description: ID sản phẩm liên quan
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng liên quan
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/check-is-exist").post(authController.protect, favoriteProductsController.checkExistFavoriteProduct);

module.exports = router;
