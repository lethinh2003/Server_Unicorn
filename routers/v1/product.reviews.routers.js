const express = require("express");
const productReviewsController = require("../../controllers/product.reviews.controller");
const authController = require("../../controllers/auth.controller");
const { uploadCloud: fileUploader } = require("../../configs/cloudinary.config");

const router = express.Router();

/**
 * @swagger
 * /products/reviews/rating-overview:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy thông số tổng quan các reviews của sản phẩm
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         default: "65118ec85700f56d346034e7"
 *         description: "ID của product"
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
 *                     average:
 *                       type: integer
 *                       example: 5
 *                       description: "avarage 5 star on 5 star"
 *                     count_1:
 *                       type: integer
 *                       example: 0
 *                       description: "count rating 1 star"
 *                     count_2:
 *                       type: integer
 *                       example: 0
 *                       description: "count rating 2 star"
 *                     count_3:
 *                       type: integer
 *                       example: 0
 *                       description: "count rating 3 star"
 *                     count_4:
 *                       type: integer
 *                       example: 0
 *                       description: "count rating 4 star"
 *                     count_5:
 *                       type: integer
 *                       example: 1
 *                       description: "count rating 5 star"
 *                     count_reviews:
 *                       type: integer
 *                       example: 1
 *                       description: "count all review"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65118ec85700f56d346034e7"
 */
router.route("/rating-overview").get(productReviewsController.getRatingOverviewByProduct);

/**
 * @swagger
 * /products/reviews/upload-images:
 *   post:
 *     tags:
 *       - Products
 *     summary: Upload ảnh review
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *                       fileName:
 *                         type: string
 *                         example: "peakpx (1).jpg"
 *                       fileUrl:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dkjjr9xra/image/upload/v1705030884/unicorn/peakpx_%281%29_6223831.jpg"
 *                       typeFile:
 *                         type: string
 *                         example: "image/jpeg"
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/upload-images").post(authController.protect, fileUploader.array("file"), productReviewsController.uploadImages);

/**
 * @swagger
 * /products/reviews:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy danh sách các reviews từ một sản phẩm
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         default: "65118ec85700f56d346034e7"
 *         description: "ID của product"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: true
 *         default: "desc"
 *         description: "Loại sort theo thời gian tạo: asc (Cũ nhất) || desc (Mới nhất)"
 *       - in: query
 *         name: rating
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "Loại rating (số sao):  1 || 2 || 3 || 4 || 5 || all "
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "Loại reviews: all (tất cả) || image (chỉ có ảnh)"
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
 *                         example: "651296c7524d80107c10a0f0"
 *                       review_images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455365/sub/goods_455365_sub14.jpg?width=750"
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       product_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "65118dbdeb6baf6ff0fa1756"
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
 *                       review_comment:
 *                         type: string
 *                         example: "Sản phẩm tuyệt vời"
 *                       createdAt:
 *                         type: string
 *                         example: "2023-09-26T08:31:03.984Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2023-09-26T08:31:03.984Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "650d3f4f421ed24dc41454bb"
 *                           name:
 *                             type: string
 *                             example: "LeThinh"
 *                       product_size:
 *                         type: object
 *                         properties:
 *                           product_size_name:
 *                             type: string
 *                             example: "S"
 *                       review_star:
 *                         type: integer
 *                         example: 5
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65118f075700f56d346034ef"
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     itemsOfPage:
 *                       type: string
 *                       example: "1"
 *                     sort:
 *                       type: string
 *                       example: "asc"
 *                     rating:
 *                       type: string
 *                       example: "all"
 *                     type:
 *                       type: string
 *                       example: "all"
 *                     limit:
 *                       type: integer
 *                       example: 1
 *                     results:
 *                       type: integer
 *                       example: 1
 */
router.route("/").get(productReviewsController.getReviewsByProduct);

/**
 * @swagger
 * /products/reviews:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo mới review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 required: true
 *                 example: "65118dbdeb6baf6ff0fa1756"
 *               productSize:
 *                 type: string
 *                 required: true
 *                 example: "650ea8a4828567aff85ca693"
 *               reviewStart:
 *                 type: number
 *                 required: true
 *                 example: 5
 *               reviewComment:
 *                 type: string
 *                 required: true
 *                 example: "Sản phẩm ổn trong tầm giá"
 *               reviewImages:
 *                 type: array
 *                 example: ["https://res.cloudinary.com/dkjjr9xra/image/upload/v1705030884/unicorn/peakpx_%281%29_6223831.jpg"]
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
 *                   example: "Tạo đánh giá thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     review_star:
 *                       type: integer
 *                       example: 5
 *                     review_images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dkjjr9xra/image/upload/v1705030884/unicorn/peakpx_%281%29_6223831.jpg"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     _id:
 *                       type: string
 *                       example: "65a0b4e527894d51101416fe"
 *                     product_id:
 *                       type: string
 *                       example: "65118dbdeb6baf6ff0fa1756"
 *                     review_comment:
 *                       type: string
 *                       example: "Good\nGood"
 *                     product_size:
 *                       type: string
 *                       example: "650ea8a4828567aff85ca693"
 *                     user:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-12T03:41:25.023Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-01-12T03:41:25.023Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65118dbdeb6baf6ff0fa1756"
 *                     reviewStart:
 *                       type: integer
 *                       example: 5
 *                     reviewComment:
 *                       type: string
 *                       example: "Sản phẩm ổn trong tầm giá"
 *                     reviewImages:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dkjjr9xra/image/upload/v1705030884/unicorn/peakpx_%281%29_6223831.jpg"
 *                     productSize:
 *                       type: string
 *                       example: "650ea8a4828567aff85ca693"
 *                     userId:
 *                       type: string
 *                       example: "650d3f4f421ed24dc41454bb"
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").post(authController.protect, productReviewsController.createReview);

module.exports = router;
