const express = require("express");
const productsController = require("../controllers/products.controller");
const authController = require("../controllers/auth.controller");
const productReviewsRouters = require("../routers/product.reviews.routers");

const router = express.Router();
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
 *                   example: []
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

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentProductId:
 *                 type: string
 *                 example: "652296b4e5c044256403216e"
 *               productName:
 *                 type: string
 *                 example: "AIRism Cotton Áo Thun Kẻ Sọc Cổ Tròn Dáng Rộng"
 *               productColor:
 *                 type: string
 *                 example: "652c96efe5c0442564032176"
 *               productSizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size_type:
 *                       type: string
 *                 example: [
 *                   { size_type: "650ea84a828567aff85ca68f" },
 *                   { size_type: "650ea87a828567aff85ca690" },
 *                   { size_type: "650ea88a828567aff85ca691" },
 *                   { size_type: "650ea893828567aff85ca692" },
 *                   { size_type: "650ea8a4828567aff85ca693" },
 *                   { size_type: "650ea8ae828567aff85ca694" }
 *                 ]
 *               productCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["650ebe49baa58c5aece0d7ed", "650ebeb5baa58c5aece0d7ef"]
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [
 *                   "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/461914/item/goods_32_461914.jpg?width=750",
 *                   "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/461914/sub/goods_461914_sub1.jpg?width=750",
 *                   "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461914/sub/vngoods_461914_sub4.jpg?width=750",
 *                   "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/461914/sub/goods_461914_sub11.jpg?width=750",
 *                   "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/461914/sub/goods_461914_sub14.jpg?width=750",
 *                   "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/461914/sub/goods_461914_sub23.jpg?width=750",
 *                   "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/461914/sub/vngoods_461914_sub29.jpg?width=750"
 *                 ]
 *               productGender:
 *                 type: string
 *                 example: "men"
 *               productOriginalPrice:
 *                 type: number
 *                 example: 391000
 *               productDescription:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     content:
 *                       type: string
 *                 example: [
 *                   { type: "overview", content: "Vải AIRism mượt mà với vẻ ngoài của cotton. Thiết kế sọc hẹp đa năng" },
 *                   { type: "material", content: "Bông" }
 *                 ]
 *     responses:
 *       '201':
 *         description: Tạo sản phẩm thành công
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
 *                   example: "created"
 *                 message:
 *                   type: string
 *                   example: "Tạo sản phẩm thành công"
 *                 data:
 *                   type: string
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").post(authController.protect, authController.reStrictTo("admin"), productsController.createProduct);

router.route("/latest-collection").get(productsController.getLatestProducts);
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
 *                   example: []
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     results:
 *                       type: integer
 *                   example:
 *                     limit: 0
 *                     results: 0
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
 *                   example: {}
 *                 metadata:
 *                   type: object
 *                   example: {}
 */

router.route("/:productId").get(productsController.getDetailProduct);

module.exports = router;
