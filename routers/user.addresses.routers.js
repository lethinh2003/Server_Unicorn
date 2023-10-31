const express = require("express");
const userAddressesController = require("../controllers/user.addresses.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();
/**
 * @swagger
 * /users/addresses:
 *   get:
 *     tags:
 *       - User Addresses
 *     summary: Lấy danh sách địa chỉ user
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
 *                       default:
 *                         type: boolean
 *                       status:
 *                         type: boolean
 *                       user_id:
 *                         type: string
 *                       provine:
 *                         type: string
 *                       district:
 *                         type: string
 *                       ward:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       phone_number:
 *                         type: string
 *                       detail_address:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       __v:
 *                         type: integer
 *                   example:
 *                     - _id: "65150cd24dc0a768743d975d"
 *                       default: true
 *                       status: true
 *                       user_id: "650d3f4f421ed24dc41454bb"
 *                       provine: "TPHCM"
 *                       district: "Quận 12"
 *                       ward: "Phường 1"
 *                       full_name: "Lê Văn Thịnh"
 *                       phone_number: "0369084341"
 *                       detail_address: "130/20"
 *                       createdAt: "2023-09-28T05:19:14.666Z"
 *                       updatedAt: "2023-09-28T05:19:14.666Z"
 *                       __v: 0
 *                     - _id: "652c7b6de1c8890a9ca4338a"
 *                       default: false
 *                       status: true
 *                       user_id: "650d3f4f421ed24dc41454bb"
 *                       provine: "TPHCM"
 *                       district: "Quận 1"
 *                       ward: "Phường 12"
 *                       full_name: "Lê Văn Thịnh"
 *                       phone_number: "0369084341"
 *                       detail_address: "130/20"
 *                       createdAt: "2023-10-15T23:53:17.235Z"
 *                       updatedAt: "2023-10-15T23:53:17.235Z"
 *                       __v: 0
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
 *                     results: 2
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */

router.route("/").get(authController.protect, userAddressesController.getUserAddresses);

/**
 * @swagger
 * /users/addresses:
 *   post:
 *     tags:
 *       - User Addresses
 *     summary: Tạo mới địa chỉ user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provine:
 *                 type: string
 *                 example: "TPHCM"
 *               district:
 *                 type: string
 *                 example: "Quận 1"
 *               ward:
 *                 type: string
 *                 example: "Phường 12"
 *               fullName:
 *                 type: string
 *                 example: "Lê Văn Thịnh"
 *               phoneNumber:
 *                 type: string
 *                 example: "0369084341"
 *               detailAddress:
 *                 type: string
 *                 example: "130/20"
 *               isDefault:
 *                 type: boolean
 *                 example: true
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
 *                   example: "created"
 *                 message:
 *                   type: string
 *                   example: "Thêm địa chỉ thành công"
 *                 data:
 *                   type: object
 *                   example: null

 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/").post(authController.protect, userAddressesController.createAddress);

/**
 * @swagger
 * /users/addresses/update:
 *   post:
 *     tags:
 *       - User Addresses
 *     summary: Cập nhật địa chỉ user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *                 example: "65150cd24dc0a768743d975d"
 *               provine:
 *                 type: string
 *                 example: "TPHCM"
 *               district:
 *                 type: string
 *                 example: "Quận 1"
 *               ward:
 *                 type: string
 *                 example: "Phường 12"
 *               fullName:
 *                 type: string
 *                 example: "Lê Văn Thịnh"
 *               phoneNumber:
 *                 type: string
 *                 example: "0369084341"
 *               detailAddress:
 *                 type: string
 *                 example: "130/20"
 *               isDefault:
 *                 type: boolean
 *                 example: true
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
 *                   example: "Cập nhật địa chỉ thành công"
 *                 data:
 *                   type: object
 *                   example: null

 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/update").post(authController.protect, userAddressesController.updateAddress);

/**
 * @swagger
 * /users/addresses/delete:
 *   post:
 *     tags:
 *       - User Addresses
 *     summary: Xóa địa chỉ user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *                 example: "65150cd24dc0a768743d975d"
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
 *                   example: "Xóa địa chỉ thành công"
 *                 data:
 *                   type: object
 *                   example: null

 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/delete").post(authController.protect, userAddressesController.deleteAddress);

/**
 * @swagger
 * /users/addresses/{addressId}:
 *   get:
 *     tags:
 *       - User Addresses
 *     summary: Lấy thông tin chi tiết địa chỉ user
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
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
 *                     default:
 *                       type: boolean
 *                     status:
 *                       type: boolean
 *                     user_id:
 *                       type: string
 *                     provine:
 *                       type: string
 *                     district:
 *                       type: string
 *                     ward:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     detail_address:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *                   example:
 *                     _id: "65332d646c88e0040831e990"
 *                     default: false
 *                     status: true
 *                     user_id: "650d3f4f421ed24dc41454bb"
 *                     provine: "TPHCM"
 *                     district: "Quận 12"
 *                     ward: "Phường 12"
 *                     full_name: "Lê Văn Thịnh"
 *                     phone_number: "0369084341"
 *                     detail_address: "130/20"
 *                     createdAt: "2023-10-21T01:46:12.201Z"
 *                     updatedAt: "2023-10-26T13:59:21.563Z"
 *                     __v: 0
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     addressId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                   example:
 *                     addressId: "65332d646c88e0040831e990"
 *                     userId: "650d3f4f421ed24dc41454bb"
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 */
router.route("/:addressId").get(authController.protect, userAddressesController.getDetailUserAddresses);

module.exports = router;
