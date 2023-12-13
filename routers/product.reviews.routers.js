const express = require("express");
const productReviewsController = require("../controllers/product.reviews.controller");
const authController = require("../controllers/auth.controller");
const { uploadCloud: fileUploader } = require("../configs/cloudinary.config");

const router = express.Router();
/**
 * @swagger
 * /products/reviews:
 *   get:
 *     tags:
 *       - Product Reviews
 *     summary: Lấy danh sách các reviews của sản phẩm
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
 *         description: "Loại sort theo thời gian tạo: asc || desc"
 *       - in: query
 *         name: rating
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "Loại rating:  1 || 2 || 3 || 4 || 5 || all "
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         default: "all"
 *         description: "Loại reviews: all || image"
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
 *                     sort:
 *                       type: string
 *                     rating:
 *                       type: string
 *                     type:
 *                       type: string
 *                     productId:
 *                       type: string
 *                     results:
 *                       type: integer
 *                   example:
 *                     page: 1
 *                     limit: 10
 *                     sort: "desc"
 *                     rating: "all"
 *                     type: "all"
 *                     productId: "65118ec85700f56d346034e7"
 *                     results: 0
 */
router.route("/").get(productReviewsController.getReviewsByProduct);

/**
 * @swagger
 * /products/reviews/rating-overview:
 *   get:
 *     tags:
 *       - Product Reviews
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
 *                       example: "652c954e8b70bf0b84037396"
 *                     results:
 *                       type: integer
 *                       example: 0
 */
router.route("/rating-overview").get(productReviewsController.getRatingOverviewByProduct);

router.route("/upload-images").post(authController.protect, fileUploader.array("file"), productReviewsController.uploadImages);

/**
 * @swagger
 * /products/reviews:
 *   post:
 *     tags:
 *       - Product Reviews
 *     summary: Tạo mới review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentProductId:
 *                 type: string
 *                 example: "65118dbdeb6baf6ff0fa1756"
 *               productId:
 *                 type: string
 *                 example: "65118f075700f56d346034ef"
 *               reviewStart:
 *                 type: string
 *                 example: "5"
 *               reviewComment:
 *                 type: string
 *                 example: "Sản phẩm ổn trong tầm giá"
 *               reviewImages:
 *                 type: array
 *                 example: []
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
 *                   example: "Created"
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
router.route("/").post(authController.protect, productReviewsController.createReview);

module.exports = router;
