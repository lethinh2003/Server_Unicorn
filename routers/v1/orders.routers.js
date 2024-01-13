const express = require("express");
const ordersController = require("../../controllers/orders.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Lấy thông tin chi tiết đơn hàng
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         default: "65118ec85700f56d346034e7"
 *         description: "ID của đơn hàng muốn lấy thông tin chi tiết"
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
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65a23290b8214461b8b56052"
 *                     note:
 *                       type: string
 *                       example: ""
 *                     subTotal:
 *                       type: number
 *                       example: 732500
 *                     shippingCost:
 *                       type: number
 *                       example: 30000
 *                     discountAmount:
 *                       type: number
 *                       example: 732500
 *                     total:
 *                       type: number
 *                       example: 30000
 *                     order_status:
 *                       type: string
 *                       example: "cancelled"
 *                     order_method:
 *                       type: string
 *                       example: "cash"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                     voucher:
 *                       type: null
 *                       example: null
 *                     address:
 *                       type: object
 *                       properties:
 *                         provine:
 *                           type: string
 *                           example: "TPHCM"
 *                         district:
 *                           type: string
 *                           example: "Quận 11"
 *                         ward:
 *                           type: string
 *                           example: "Phường 1"
 *                         full_name:
 *                           type: string
 *                           example: "Lê Văn Thịnh"
 *                         phone_number:
 *                           type: string
 *                           example: "036908431"
 *                         detail_address:
 *                           type: string
 *                           example: "130/2"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-13T06:49:52.556Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-01-13T06:56:41.689Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     listOrderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "65a23290b8214461b8b56055"
 *                           data:
 *                             type: object
 *                             properties:
 *                               quantities:
 *                                 type: integer
 *                                 example: 1
 *                               totalAmount:
 *                                 type: number
 *                                 example: 293000
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     example: "65118f205700f56d346034f7"
 *                                   product_images:
 *                                     type: array
 *                                     items:
 *                                       type: string
 *                                       example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_13_422992.jpg?width=750"
 *                                   product_gender:
 *                                     type: string
 *                                     example: "men"
 *                                   product_original_price:
 *                                     type: number
 *                                     example: 293000
 *                                   product_name:
 *                                     type: string
 *                                     example: "Áo Thun Cổ Tròn Ngắn Tay"
 *                                   product_color:
 *                                     type: object
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         example: "650eb110b30a24284036eadb"
 *                                       status:
 *                                         type: boolean
 *                                         example: true
 *                                       product_color_name:
 *                                         type: string
 *                                         example: "Đỏ"
 *                                       product_color_code:
 *                                         type: string
 *                                         example: "#eb3417"
 *                                   size:
 *                                     type: object
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         example: "650ea84a828567aff85ca68f"
 *                                       product_size_name:
 *                                         type: string
 *                                         example: "XS"
 *                           status:
 *                             type: boolean
 *                             example: true
 *                           order_id:
 *                             type: string
 *                             example: "65a23290b8214461b8b56052"
 *                           user_id:
 *                             type: string
 *                             example: "650d3f4f421ed24dc41454bb"
 *                           createdAt:
 *                             type: string
 *                             example: "2024-01-13T06:49:52.647Z"
 *                           updatedAt:
 *                             type: string
 *                             example: "2024-01-13T06:49:52.647Z"
 *                           __v:
 *                             type: integer
 *                             example: 0
 *                 metadata:
 *                   type: object
 *                   example: {}

 */
router.route("/:orderId").get(authController.protect, ordersController.getDetailedOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Lấy danh sách đơn hàng
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
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         default: all
 *         description: all | pending | payment_pending | delivering | delivered | cancelled
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
 *                         example: "659e4647aed0f05530a60843"
 *                         description: ID của đơn hàng
 *                       note:
 *                         type: string
 *                         example: ""
 *                         description: Ghi chú đơn hàng
 *                       subTotal:
 *                         type: integer
 *                         example: 1588000
 *                         description: Tổng tiền hàng trước chiết khấu và phí vận chuyển
 *                       shippingCost:
 *                         type: integer
 *                         example: 30000
 *                         description: Phí vận chuyển
 *                       discountAmount:
 *                         type: integer
 *                         example: 0
 *                         description: Số tiền chiết khấu
 *                       total:
 *                         type: integer
 *                         example: 1618000
 *                         description: Tổng số tiền cần thanh toán
 *                       order_status:
 *                         type: string
 *                         example: "delivering"
 *                         description: Trạng thái đơn hàng
 *                       order_method:
 *                         type: string
 *                         example: "cash"
 *                         description: Phương thức thanh toán
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của đơn hàng
 *                       user:
 *                         type: string
 *                         example: "650d3f4f421ed24dc41454bb"
 *                         description: ID của người dùng
 *                       address:
 *                         type: object
 *                         properties:
 *                           provine:
 *                             type: string
 *                             example: "Tỉnh Tuyên Quang"
 *                             description: Tỉnh/Thành phố của địa chỉ
 *                           district:
 *                             type: string
 *                             example: "Huyện Lâm Bình"
 *                             description: Quận/Huyện của địa chỉ
 *                           ward:
 *                             type: string
 *                             example: "Xã Khuôn Hà"
 *                             description: Xã/Phường của địa chỉ
 *                           full_name:
 *                             type: string
 *                             example: "Lê Văn Thịnh"
 *                             description: Họ tên người nhận hàng
 *                           phone_number:
 *                             type: string
 *                             example: "0767644854"
 *                             description: Số điện thoại người nhận hàng
 *                           detail_address:
 *                             type: string
 *                             example: "Khu phố Đa Ngư"
 *                             description: Địa chỉ chi tiết
 *                       createdAt:
 *                         type: string
 *                         example: "2024-01-10T07:24:55.390Z"
 *                         description: Thời gian tạo đơn hàng
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-10T07:26:01.260Z"
 *                         description: Thời gian cập nhật đơn hàng
 *                       __v:
 *                         type: integer
 *                         example: 0
 *                         description: Phiên bản của dữ liệu
 *                       order_items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "659e4647aed0f05530a60845"
 *                               description: ID của mục trong đơn hàng
 *                             data:
 *                               type: object
 *                               properties:
 *                                 quantities:
 *                                   type: integer
 *                                   example: 1
 *                                   description: Số lượng sản phẩm
 *                                 totalAmount:
 *                                   type: integer
 *                                   example: 1588000
 *                                   description: Tổng số tiền cho sản phẩm này
 *                                 product:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                       example: "65462d39f259735ee80b96f4"
 *                                       description: ID của sản phẩm
 *                                     product_images:
 *                                       type: array
 *                                       items:
 *                                         type: string
 *                                         example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461994/item/vngoods_00_461994.jpg?width=750"
 *                                         description: Link ảnh sản phẩm
 *                                       description: Danh sách link ảnh sản phẩm
 *                                     product_gender:
 *                                       type: string
 *                                       example: "men"
 *                                       description: Giới tính của sản phẩm
 *                                     product_original_price:
 *                                       type: integer
 *                                       example: 1588000
 *                                       description: Giá gốc của sản phẩm
 *                                     product_name:
 *                                       type: string
 *                                       example: "Áo Thun Dry-EX Cổ Tròn Ngắn Tay (Họa Tiết)"
 *                                       description: Tên của sản phẩm
 *                                     product_color:
 *                                       type: object
 *                                       properties:
 *                                         _id:
 *                                           type: string
 *                                           example: "650eb01246193f4ddcf7862c"
 *                                           description: ID của màu sắc
 *                                         status:
 *                                           type: boolean
 *                                           example: true
 *                                           description: Trạng thái của màu sắc
 *                                         product_color_name:
 *                                           type: string
 *                                           example: "Trắng"
 *                                           description: Tên màu sắc
 *                                         product_color_code:
 *                                           type: string
 *                                           example: "#fff"
 *                                           description: Mã màu sắc
 *                                   size:
 *                                     type: object
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         example: "650ea87a828567aff85ca690"
 *                                         description: ID của kích thước
 *                                       product_size_name:
 *                                         type: string
 *                                         example: "S"
 *                                         description: Tên kích thước
 *                             status:
 *                               type: boolean
 *                               example: true
 *                               description: Trạng thái của mục trong đơn hàng
 *                             order_id:
 *                               type: string
 *                               example: "659e4647aed0f05530a60843"
 *                               description: ID của đơn hàng
 *                             user_id:
 *                               type: string
 *                               example: "650d3f4f421ed24dc41454bb"
 *                               description: ID của người dùng
 *                             createdAt:
 *                               type: string
 *                               example: "2024-01-10T07:24:55.467Z"
 *                               description: Thời gian tạo mục trong đơn hàng
 *                             updatedAt:
 *                               type: string
 *                               example: "2024-01-10T07:24:55.467Z"
 *                               description: Thời gian cập nhật mục trong đơn hàng
 *                             __v:
 *                               type: integer
 *                               example: 0
 *                               description: Phiên bản của dữ liệu

 *                 metadata:
 *                   type: object
 *                   properties:
 *                     itemsOfPage:
 *                       type: string
 *                       example: "1"
 *                       description: Số lượng mục trên mỗi trang
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Trang hiện tại
 *                     limit:
 *                       type: integer
 *                       example: 1
 *                       description: Số lượng mục trên mỗi trang
 *                     results:
 *                       type: integer
 *                       example: 1
 *                       description: Tổng số mục
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").get(authController.protect, ordersController.getListOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Tạo đơn hàng mới
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 example: ""
 *                 description: Ghi chú
 *               voucher:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "659c12fe339b836440d7b1aa"
 *                     description: ID của voucher
 *                   discount:
 *                     type: integer
 *                     example: 100
 *                     description: Số tiền giảm giá
 *                   min_order_quantity:
 *                     type: integer
 *                     example: 0
 *                     description: Số lượng đơn hàng tối thiểu để áp dụng voucher
 *                   min_order_amount:
 *                     type: integer
 *                     example: 0
 *                     description: Giá trị đơn hàng tối thiểu để áp dụng voucher
 *                   type:
 *                     type: string
 *                     example: "amount"
 *                     description: Loại voucher (amount hoặc percentage)
 *                   status:
 *                     type: boolean
 *                     example: true
 *                     description: Trạng thái của voucher
 *                   user:
 *                     type: string
 *                     example: "650d3f4f421ed24dc41454bb"
 *                     description: ID của người dùng sở hữu voucher
 *                   code:
 *                     type: string
 *                     example: "JAFOROZ3G5STYFT"
 *                     description: Mã voucher
 *                   description:
 *                     type: string
 *                     example: "Giảm 100% tổng tiền"
 *                     description: Mô tả voucher
 *                   expired_date:
 *                     type: string
 *                     example: "2024-01-17T17:00:00.000Z"
 *                     description: Ngày hết hạn của voucher
 *                   createdAt:
 *                     type: string
 *                     example: "2024-01-08T15:21:34.118Z"
 *                     description: Thời gian tạo voucher
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-01-08T15:21:34.118Z"
 *                     description: Thời gian cập nhật voucher
 *                 description: Thông tin về voucher
 *               address:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "659f5aaa11a2b243f8dc0d90"
 *                     description: ID của địa chỉ
 *                   default:
 *                     type: boolean
 *                     example: true
 *                     description: Địa chỉ mặc định hay không
 *                   status:
 *                     type: boolean
 *                     example: true
 *                     description: Trạng thái của địa chỉ
 *                   user_id:
 *                     type: string
 *                     example: "650d3f4f421ed24dc41454bb"
 *                     description: ID của người dùng sở hữu địa chỉ
 *                   provine:
 *                     type: string
 *                     example: "TPHCM"
 *                     description: Tỉnh/Thành phố
 *                   district:
 *                     type: string
 *                     example: "Quận 11"
 *                     description: Quận/Huyện
 *                   ward:
 *                     type: string
 *                     example: "Phường 1"
 *                     description: Phường/Xã
 *                   full_name:
 *                     type: string
 *                     example: "Lê Văn Thịnh"
 *                     description: Họ tên người nhận hàng
 *                   phone_number:
 *                     type: string
 *                     example: "036908431"
 *                     description: Số điện thoại người nhận hàng
 *                   detail_address:
 *                     type: string
 *                     example: "130/2"
 *                     description: Địa chỉ chi tiết
 *                   createdAt:
 *                     type: string
 *                     example: "2024-01-11T03:04:10.226Z"
 *                     description: Thời gian tạo địa chỉ
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-01-11T03:06:56.070Z"
 *                     description: Thời gian cập nhật địa chỉ
 *                 description: Thông tin về địa chỉ
 *               paymentMethod:
 *                 type: string
 *                 example: "cash"
 *                 description: Phương thức thanh toán
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
 *                   properties:
 *                     note:
 *                       type: string
 *                       example: ""
 *                       description: Ghi chú
 *                     subTotal:
 *                       type: integer
 *                       example: 732500
 *                       description: Tổng tiền hàng trước giảm giá và phí vận chuyển
 *                     shippingCost:
 *                       type: integer
 *                       example: 30000
 *                       description: Phí vận chuyển
 *                     discountAmount:
 *                       type: integer
 *                       example: 732500
 *                       description: Số tiền giảm giá
 *                     total:
 *                       type: integer
 *                       example: 30000
 *                       description: Tổng tiền thanh toán
 *                     order_status:
 *                       type: string
 *                       example: "pending"
 *                       description: Trạng thái đơn hàng
 *                     order_method:
 *                       type: string
 *                       example: "cash"
 *                       description: Phương thức thanh toán
 *                     status:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái của đơn hàng
 *                     _id:
 *                       type: string
 *                       example: "65a23290b8214461b8b56052"
 *                       description: ID của đơn hàng
 *                     user:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                       description: ID của người dùng đặt hàng
 *                     voucher:
 *                       type: object
 *                       properties:
 *                         discount:
 *                           type: integer
 *                           example: 100
 *                           description: Số tiền giảm giá từ voucher
 *                         min_order_quantity:
 *                           type: integer
 *                           example: 0
 *                           description: Số lượng đơn hàng tối thiểu để áp dụng voucher
 *                         min_order_amount:
 *                           type: integer
 *                           example: 0
 *                           description: Giá trị đơn hàng tối thiểu để áp dụng voucher
 *                         type:
 *                           type: string
 *                           example: "amount"
 *                           description: Loại voucher (amount hoặc percentage)
 *                         code:
 *                           type: string
 *                           example: "JAFOROZ3G5STYFT"
 *                           description: Mã voucher
 *                         description:
 *                           type: string
 *                           example: "Giảm 100% tổng tiền"
 *                           description: Mô tả voucher
 *                         expired_date:
 *                           type: string
 *                           example: "2024-01-17T17:00:00.000Z"
 *                           description: Ngày hết hạn của voucher
 *                         createdAt:
 *                           type: string
 *                           example: "2024-01-08T15:21:34.118Z"
 *                           description: Thời gian tạo voucher
 *                     address:
 *                       type: object
 *                       properties:
 *                         provine:
 *                           type: string
 *                           example: "TPHCM"
 *                           description: Tỉnh/Thành phố
 *                         district:
 *                           type: string
 *                           example: "Quận 11"
 *                           description: Quận/Huyện
 *                         ward:
 *                           type: string
 *                           example: "Phường 1"
 *                           description: Phường/Xã
 *                         full_name:
 *                           type: string
 *                           example: "Lê Văn Thịnh"
 *                           description: Họ tên người nhận hàng
 *                         phone_number:
 *                           type: string
 *                           example: "036908431"
 *                           description: Số điện thoại người nhận hàng
 *                         detail_address:
 *                           type: string
 *                           example: "130/2"
 *                           description: Địa chỉ chi tiết
 *                         createdAt:
 *                           type: string
 *                           example: "2024-01-13T06:49:52.556Z"
 *                           description: Thời gian tạo địa chỉ
 *                         updatedAt:
 *                           type: string
 *                           example: "2024-01-13T06:49:52.556Z"
 *                           description: Thời gian cập nhật địa chỉ
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-13T06:49:52.556Z"
 *                       description: Thời gian tạo đơn hàng
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-01-13T06:49:52.556Z"
 *                       description: Thời gian cập nhật đơn hàng
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                       description: Số lượng phiên bản của đơn hàng
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */

router.route("/").post(authController.protect, ordersController.createOrder);

/**
 * @swagger
 * /orders/cancel:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Hủy đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
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
 *                   example: "Hủy đơn hàng thành công"
 *                 data:
 *                   type: null
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: "659c12fe339b836440d7b1aa"
 *                   description: Thông tin về metadata
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/cancel").post(authController.protect, ordersController.cancelOrder);

/**
 * @swagger
 * /orders/vnpay_ipn:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Kiểm tra tình trạng thanh toán online qua VNPay
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vnp_Params:
 *                 type: object
 *                 properties:
 *                   vnp_Amount:
 *                     type: string
 *                     example: "22550000"
 *                   vnp_BankCode:
 *                     type: string
 *                     example: "NCB"
 *                   vnp_BankTranNo:
 *                     type: string
 *                     example: "VNP14280694"
 *                   vnp_CardType:
 *                     type: string
 *                     example: "ATM"
 *                   vnp_OrderInfo:
 *                     type: string
 *                     example: "Thanh+toan+cho+hoa+don%3A+65a23789d0754a48ac179d70"
 *                   vnp_PayDate:
 *                     type: string
 *                     example: "20240113141201"
 *                   vnp_ResponseCode:
 *                     type: string
 *                     example: "00"
 *                   vnp_SecureHash:
 *                     type: string
 *                     example: "aeb82ed62efc9a3bb30365788f1fd9944a9cb482481d6056dc0119c5c60ba07048dadf8d5d9b2a13addc0aef4245b6dda23233734a304740e9402bb493243d2e"
 *                   vnp_TmnCode:
 *                     type: string
 *                     example: "EQ64Q6NR"
 *                   vnp_TransactionNo:
 *                     type: string
 *                     example: "14280694"
 *                   vnp_TransactionStatus:
 *                     type: string
 *                     example: "00"
 *                   vnp_TxnRef:
 *                     type: string
 *                     example: "65a23789d0754a48ac179d70"
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
 *                   example: "Thanh toán đơn hàng thành công"
 *                 data:
 *                   type: null
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/vnpay_ipn").post(authController.protect, ordersController.checkVNPay);

module.exports = router;
