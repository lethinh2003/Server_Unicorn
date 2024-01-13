const express = require("express");
const productsController = require("../../controllers/products.controller");
const productReviewsRouters = require("./product.reviews.routers");

const router = express.Router();

/**
 * @swagger
 * /products/latest-collection:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy danh sách sản phẩm mới
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
 *                         example: "657d701efbba7738b8f888cb"
 *                       product_images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://res.cloudinary.com/dkjjr9xra/image/upload/v1702719517/unicorn/Hu9EZuw_5992757.jpg"
 *                       product_gender:
 *                         type: string
 *                         example: "women"
 *                       product_original_price:
 *                         type: number
 *                         example: 980000
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       product_name:
 *                         type: string
 *                         example: "Chân Váy Xếp Ly Vải Chiffon"
 *                       product_color:
 *                         type: object
 *                         properties:
 *                           product_color_name:
 *                             type: string
 *                             example: "Đen"
 *                           product_color_code:
 *                             type: string
 *                             example: "#3d3d3d"
 *                       product_sale_event:
 *                         type: null
 *                       createdAt:
 *                         type: string
 *                         example: "2023-12-16T09:38:38.484Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2023-12-29T17:14:28.157Z"
 *                       parent_product_id:
 *                         type: null
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     itemsOfPage:
 *                       type: string
 *                       example: "1"
 *                     limit:
 *                       type: integer
 *                       example: 1
 *                     results:
 *                       type: integer
 *                       example: 1
 */
router.route("/latest-collection").get(productsController.getLatestProducts);

/**
 * @swagger
 * /products/sale-collection:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy danh sách sản phẩm đang giảm giá
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
 *                         example: "657d701efbba7738b8f888cb"
 *                       product_images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://res.cloudinary.com/dkjjr9xra/image/upload/v1702719517/unicorn/Hu9EZuw_5992757.jpg"
 *                       product_gender:
 *                         type: string
 *                         example: "women"
 *                       product_original_price:
 *                         type: number
 *                         example: 980000
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       product_name:
 *                         type: string
 *                         example: "Chân Váy Xếp Ly Vải Chiffon"
 *                       product_color:
 *                         type: object
 *                         properties:
 *                           product_color_name:
 *                             type: string
 *                             example: "Đen"
 *                           product_color_code:
 *                             type: string
 *                             example: "#3d3d3d"
 *                       createdAt:
 *                         type: string
 *                         example: "2023-12-16T09:38:38.484Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2023-12-29T17:14:28.157Z"
 *                       parent_product_id:
 *                         type: null
 *                       product_sale_event:
 *                         type: object
 *                         properties:
 *                           sale_discount_percentage:
 *                             type: number
 *                             example: 50
 *                           sale_event_name:
 *                             type: string
 *                             example: "Khai trương giảm giá"
 *                           sale_start_date:
 *                             type: string
 *                             example: "2023-12-03T17:00:00.000Z"
 *                           sale_end_date:
 *                             type: string
 *                             example: "2023-12-29T17:00:00.000Z"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     itemsOfPage:
 *                       type: string
 *                       example: "1"
 *                     limit:
 *                       type: integer
 *                       example: 1
 *                     results:
 *                       type: integer
 *                       example: 1
 */
router.route("/sale-collection").get(productsController.getSaleProducts);

/**
 * @swagger
 * /products/suggesting:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy danh sách sản phẩm đề xuất từ một sản phẩm
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: "ID của product muốn lấy sản phẩm đề xuất"
 *       - in: query
 *         name: itemsOfPage
 *         schema:
 *           type: integer
 *         required: true
 *         default: 5
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
 *                         example: "65462d39f259735ee80b96f4"
 *                       product_images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461994/item/vngoods_00_461994.jpg?width=750"
 *                       product_gender:
 *                         type: string
 *                         example: "men"
 *                       product_original_price:
 *                         type: number
 *                         example: 1588000
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       product_name:
 *                         type: string
 *                         example: "Áo Thun Dry-EX Cổ Tròn Ngắn Tay (Họa Tiết)"
 *                       product_color:
 *                         type: object
 *                         properties:
 *                           product_color_name:
 *                             type: string
 *                             example: "Trắng"
 *                           product_color_code:
 *                             type: string
 *                             example: "#fff"
 *                       product_sale_event:
 *                         type: object
 *                         properties:
 *                           sale_discount_percentage:
 *                             type: number
 *                             example: 50
 *                           sale_event_name:
 *                             type: string
 *                             example: "Khai trương giảm giá"
 *                           sale_start_date:
 *                             type: string
 *                             example: "2023-12-03T17:00:00.000Z"
 *                           sale_end_date:
 *                             type: string
 *                             example: "2023-12-29T17:00:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         example: "2023-11-04T11:38:33.290Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-10T07:24:55.034Z"
 *                       child_products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "65462d4ff259735ee80b96fe"
 *                             product_images:
 *                               type: array
 *                               items:
 *                                 type: string
 *                                 example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461994/item/vngoods_08_461994.jpg?width=750"
 *                             product_gender:
 *                               type: string
 *                               example: "men"
 *                             product_original_price:
 *                               type: number
 *                               example: 1588000
 *                             status:
 *                               type: boolean
 *                               example: true
 *                             parent_product_id:
 *                               type: string
 *                               example: "65462d39f259735ee80b96f4"
 *                             product_name:
 *                               type: string
 *                               example: "Áo Thun Dry-EX Cổ Tròn Ngắn Tay (Họa Tiết)"
 *                             product_color:
 *                               type: object
 *                               properties:
 *                                 product_color_name:
 *                                   type: string
 *                                   example: "Xám"
 *                                 product_color_code:
 *                                   type: string
 *                                   example: "#dedede"
 *                             createdAt:
 *                               type: string
 *                               example: "2023-11-04T11:38:55.371Z"
 *                             updatedAt:
 *                               type: string
 *                               example: "2023-11-04T11:38:55.371Z"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     results:
 *                       type: integer
 *                   example:
 *                     limit: 5
 *                     productId: "65118dbdeb6baf6ff0fa1756"
 *                     results: 1
 */
router.route("/suggesting").get(productsController.getSuggestProducts);

// Product review router
router.use("/reviews", productReviewsRouters);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy thông tin chi tiết từ một sản phẩm
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         default: "65118ec85700f56d346034e7"
 *         description: "ID của product muốn lấy thông tin chi tiết"
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
 *                       example: "65118ec85700f56d346034e7"
 *                     product_categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "650ebe49baa58c5aece0d7ed"
 *                           product_category_name:
 *                             type: string
 *                             example: "Áo"
 *                           product_category_keyword:
 *                             type: string
 *                             example: "tops"
 *                     product_images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_07_422992.jpg?width=750"
 *                     product_gender:
 *                       type: string
 *                       example: "men"
 *                     product_original_price:
 *                       type: number
 *                       example: 293000
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     parent_product_id:
 *                       type: string
 *                       example: "65118dbdeb6baf6ff0fa1756"
 *                     product_name:
 *                       type: string
 *                       example: "Áo Thun Cổ Tròn Ngắn Tay"
 *                     product_color:
 *                       type: object
 *                       properties:
 *                         product_color_name:
 *                           type: string
 *                           example: "Xám"
 *                         product_color_code:
 *                           type: string
 *                           example: "#dedede"
 *                     product_sizes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size_quantities:
 *                             type: integer
 *                             example: 0
 *                           size_type:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "650ea84a828567aff85ca68f"
 *                               product_size_name:
 *                                 type: string
 *                                 example: "XS"
 *                     product_description:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "overview"
 *                           content:
 *                             type: string
 *                             example: "Áo thun cổ tròn đơn giản..."
 *                     createdAt:
 *                       type: string
 *                       example: "2023-09-25T13:44:40.055Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2023-10-16T02:23:44.822Z"
 *                     relation_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "65118dbdeb6baf6ff0fa1756"
 *                           product_images:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_00_422992.jpg?width=750"
 *                           product_gender:
 *                             type: string
 *                             example: "men"
 *                           product_original_price:
 *                             type: number
 *                             example: 293000
 *                           status:
 *                             type: boolean
 *                             example: true
 *                           product_name:
 *                             type: string
 *                             example: "Áo Thun Cổ Tròn Ngắn Tay"
 *                           product_color:
 *                             type: object
 *                             properties:
 *                               product_color_name:
 *                                 type: string
 *                                 example: "Trắng"
 *                               product_color_code:
 *                                 type: string
 *                                 example: "#fff"
 *                           createdAt:
 *                             type: string
 *                             example: "2023-09-25T13:40:13.757Z"
 *                           updatedAt:
 *                             type: string
 *                             example: "2024-01-10T07:18:51"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 65118ec85700f56d346034e7
 */
router.route("/:productId").get(productsController.getDetailProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy danh sách sản phẩm
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "ID của category"
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         required: true
 *         default: "men"
 *         description: "Loại đồ: men || women"
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "ID của color"
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "ID của size"
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
 *                         example: "65462d39f259735ee80b96f4"
 *                       product_images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461994/item/vngoods_00_461994.jpg?width=750"
 *                       product_gender:
 *                         type: string
 *                         example: "men"
 *                       product_original_price:
 *                         type: number
 *                         example: 1588000
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       product_name:
 *                         type: string
 *                         example: "Áo Thun Dry-EX Cổ Tròn Ngắn Tay (Họa Tiết)"
 *                       product_color:
 *                         type: object
 *                         properties:
 *                           product_color_name:
 *                             type: string
 *                             example: "Trắng"
 *                           product_color_code:
 *                             type: string
 *                             example: "#fff"
 *                       product_sale_event:
 *                         type: object
 *                         properties:
 *                           sale_discount_percentage:
 *                             type: number
 *                             example: 50
 *                           sale_event_name:
 *                             type: string
 *                             example: "Khai trương giảm giá"
 *                           sale_start_date:
 *                             type: string
 *                             example: "2023-12-03T17:00:00.000Z"
 *                           sale_end_date:
 *                             type: string
 *                             example: "2023-12-29T17:00:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         example: "2023-11-04T11:38:33.290Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-10T07:24:55.034Z"
 *                       child_products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "65462d4ff259735ee80b96fe"
 *                             product_images:
 *                               type: array
 *                               items:
 *                                 type: string
 *                                 example: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461994/item/vngoods_08_461994.jpg?width=750"
 *                             product_gender:
 *                               type: string
 *                               example: "men"
 *                             product_original_price:
 *                               type: number
 *                               example: 1588000
 *                             status:
 *                               type: boolean
 *                               example: true
 *                             parent_product_id:
 *                               type: string
 *                               example: "65462d39f259735ee80b96f4"
 *                             product_name:
 *                               type: string
 *                               example: "Áo Thun Dry-EX Cổ Tròn Ngắn Tay (Họa Tiết)"
 *                             product_color:
 *                               type: object
 *                               properties:
 *                                 product_color_name:
 *                                   type: string
 *                                   example: "Xám"
 *                                 product_color_code:
 *                                   type: string
 *                                   example: "#dedede"
 *                             createdAt:
 *                               type: string
 *                               example: "2023-11-04T11:38:55.371Z"
 *                             updatedAt:
 *                               type: string
 *                               example: "2023-11-04T11:38:55.371Z"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     category:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     color:
 *                       type: string
 *                     size:
 *                       type: string
 *                     results:
 *                       type: integer
 *                   example:
 *                     page: 1
 *                     limit: 10
 *                     category: "all"
 *                     gender: "all"
 *                     color: "all"
 *                     size: "all"
 *                     results: 0
 */
router.route("/").get(productsController.getAllParentProducts);

module.exports = router;
