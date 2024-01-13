const express = require("express");
const cartItemsController = require("../../controllers/cart.items.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /carts/cart-items/get-all:
 *   get:
 *     tags:
 *       - Carts
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65a0ab356cb81607b86596ca"
 *                         description: ID của dữ liệu trong giỏ hàng
 *                       data:
 *                         type: object
 *                         properties:
 *                           quantities:
 *                             type: integer
 *                             example: 2
 *                             description: Số lượng sản phẩm
 *                           product:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "65118dbdeb6baf6ff0fa1756"
 *                                 description: ID của sản phẩm
 *                               product_images:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                   example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_00_422992.jpg?width=750"
 *                                 description: Danh sách đường dẫn hình ảnh của sản phẩm
 *                               product_gender:
 *                                 type: string
 *                                 example: "men"
 *                                 description: Giới tính của sản phẩm
 *                               product_original_price:
 *                                 type: number
 *                                 example: 293000
 *                                 description: Giá gốc của sản phẩm
 *                               status:
 *                                 type: boolean
 *                                 example: true
 *                                 description: Trạng thái của sản phẩm
 *                               product_name:
 *                                 type: string
 *                                 example: "Áo Thun Cổ Tròn Ngắn Tay"
 *                                 description: Tên của sản phẩm
 *                               product_color:
 *                                 type: object
 *                                 properties:
 *                                   product_color_name:
 *                                     type: string
 *                                     example: "Trắng"
 *                                     description: Tên màu sắc của sản phẩm
 *                                   product_color_code:
 *                                     type: string
 *                                     example: "#fff"
 *                                     description: Mã màu sắc của sản phẩm
 *                               product_sizes:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     size_quantities:
 *                                       type: integer
 *                                       example: 100
 *                                       description: Số lượng sản phẩm có sẵn trong kích cỡ
 *                                     _id:
 *                                       type: string
 *                                       example: "65118dbdeb6baf6ff0fa1757"
 *                                       description: ID của kích cỡ
 *                                     size_type:
 *                                       type: string
 *                                       example: "650ea84a828567aff85ca68f"
 *                                       description: ID của loại kích cỡ
 *                               createdAt:
 *                                 type: string
 *                                 example: "2023-09-25T13:40:13.757Z"
 *                                 description: Thời gian tạo sản phẩm
 *                               updatedAt:
 *                                 type: string
 *                                 example: "2024-01-10T07:18:51.820Z"
 *                                 description: Thời gian cập nhật sản phẩm
 *                               product_sale_event:
 *                                 type: object
 *                                 properties:
 *                                   sale_discount_percentage:
 *                                     type: number
 *                                     example: 50
 *                                     description: Phần trăm giảm giá trong sự kiện khuyến mãi
 *                                   sale_event_name:
 *                                     type: string
 *                                     example: "Khai trương giảm giá"
 *                                     description: Tên sự kiện khuyến mãi
 *                                   sale_start_date:
 *                                     type: string
 *                                     example: "2023-12-03T17:00:00.000Z"
 *                                     description: Thời gian bắt đầu sự kiện khuyến mãi
 *                                   sale_end_date:
 *                                     type: string
 *                                     example: "2023-12-29T17:00:00.000Z"
 *                                     description: Thời gian kết thúc sự kiện khuyến mãi
 *                           size:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "650ea84a828567aff85ca68f"
 *                                 description: ID của kích cỡ
 *                               product_size_name:
 *                                 type: string
 *                                 example: "XS"
 *                                 description: Tên kích cỡ
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của giỏ hàng
 *                       cart_id:
 *                         type: string
 *                         example: "65446067be2f696eb0b19861"
 *                         description: ID của giỏ hàng
 *                       user_id:
 *                         type: string
 *                         example: "650d3f4f421ed24dc41454bb"
 *                         description: ID người dùng
 *                       createdAt:
 *                         type: string
 *                         example: "2024-01-12T03:00:05.852Z"
 *                         description: Thời gian tạo giỏ hàng
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-13T06:22:13.722Z"
 *                         description: Thời gian cập nhật giỏ hàng
 *                     description: Thông tin về giỏ hàng
 *                   description: Danh sách giỏ hàng
 *                 metadata:
 *                   type: object
 *                   properties:
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
 *
 */
router.route("/get-all").get(authController.protect, cartItemsController.getAllUserCartItems);
/**
 * @swagger
 * /carts/cart-items:
 *   post:
 *     tags:
 *       - Carts
 *     summary: Thêm sản phẩm mới vào trong giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "65118f205700f56d346034f7"
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
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         quantities:
 *                           type: integer
 *                           example: 1
 *                           description: Số lượng sản phẩm
 *                         product:
 *                           type: string
 *                           example: "65118f205700f56d346034f7"
 *                           description: ID của sản phẩm
 *                         size:
 *                           type: string
 *                           example: "650ea84a828567aff85ca68f"
 *                           description: ID của kích cỡ
 *                     status:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái của giỏ hàng
 *                     _id:
 *                       type: string
 *                       example: "65a22d07ba775e77d8a3db8e"
 *                       description: ID của dữ liệu trong giỏ hàng
 *                     cart_id:
 *                       type: string
 *                       example: "65446067be2f696eb0b19861"
 *                       description: ID của giỏ hàng
 *                     user_id:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID người dùng
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-13T06:26:15.042Z"
 *                       description: Thời gian tạo giỏ hàng
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-01-13T06:26:15.042Z"
 *                       description: Thời gian cập nhật giỏ hàng
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                       description: Phiên bản của dữ liệu
 *                   description: Thông tin về giỏ hàng
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65118f205700f56d346034f7"
 *                       description: ID của sản phẩm
 *                     productQuantities:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng sản phẩm trong giỏ hàng
 *                     productSize:
 *                       type: string
 *                       example: "650ea84a828567aff85ca68f"
 *                       description: ID của kích cỡ sản phẩm
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
router.route("/").post(authController.protect, cartItemsController.createCartItem);
/**
 * @swagger
 * /carts/cart-items/update-quantities:
 *   post:
 *     tags:
 *       - Carts
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
 *                 example: "65a0ab356cb81607b86596ca"
 *               productQuantitiesUpdate:
 *                 type: integer
 *                 example: 3
 *                 description: Số lượng sản phẩm muốn update lại
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
 *                   type: null
 *                   example: null
 *                   description: Dữ liệu trả về, ở đây là null vì không có dữ liệu
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     cartItemId:
 *                       type: string
 *                       example: "65a0ab356cb81607b86596ca"
 *                       description: ID của mục trong giỏ hàng
 *                     productQuantitiesUpdate:
 *                       type: integer
 *                       example: 3
 *                       description: Số lượng sản phẩm được cập nhật trong giỏ hàng
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
router.route("/update-quantities").post(authController.protect, cartItemsController.updateQuantitiesCartItem);

/**
 * @swagger
 * /carts/cart-items/delete:
 *   post:
 *     tags:
 *       - Carts
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
 *                   type: null
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     cartItemId:
 *                       type: string
 *                       example: "65118f075700f56d346034ef"
 *                       description: ID của mục trong giỏ hàng
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
router.route("/delete").post(authController.protect, cartItemsController.deleteCartItem);

module.exports = router;
