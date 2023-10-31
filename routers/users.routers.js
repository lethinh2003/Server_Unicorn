const express = require("express");
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const userAddressRouters = require("../routers/user.addresses.routers");
const router = express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy thông tin chi tiết user
 *     description: Lấy thông tin chi tiết user
 *     responses:
 *       '200':
 *         description: Thông tin chi tiết user
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
 *                     email:
 *                       type: string
 *                       example: "muradvn2003@gmail.com"
 *                     name:
 *                       type: string
 *                       example: "Le Thinh"
 *                     birthday:
 *                       type: string
 *                       format: date-time
 *                       example: "2003-10-22T00:00:00.000Z"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     phone_number:
 *                       type: string
 *                       example: "0369084341"
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */
router.route("/").get(authController.protect, usersController.getInformationUser);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Tạo mới user
 *     description: Tạo mới user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "muradvn2003@gmail.com"
 *               password:
 *                 type: string
 *                 example: "thinh123"
 *               name:
 *                 type: string
 *                 example: "Le Thinh"
 *     responses:
 *       '201':
 *         description: Tạo thành công user
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
 *                   example: "Đăng ký tài khoản thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "muradvn2003@gmail.com"
 *                     name:
 *                       type: string
 *                       example: "Le Thinh"
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */

router.route("/").post(usersController.createUser);

/**
 * @swagger
 * /users/update:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cập nhật thông tin user
 *     description: Cập nhật thông tin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               birthday:
 *                 type: string
 *                 example: "2003-10-22"
 *               gender:
 *                 type: string
 *                 description: male | female | others
 *                 example: "male"
 *               name:
 *                 type: string
 *                 example: "Le Thinh"
 *               phone_number:
 *                 type: string
 *                 example: "0369084341"
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
 *                   example: "Cập nhật thông tin thành công"
 *                 data:
 *                   type: object
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */

router.route("/update").post(authController.protect, usersController.updateInformationUser);

/**
 * @swagger
 * /users/update-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cập nhật mật khẩu user
 *     description: Cập nhật mật khẩu user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: "thinh123"
 *               new_password:
 *                 type: string
 *                 example: "thinh1234"
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
 *                   example: "Cập nhật mật khẩu thành công"
 *                 data:
 *                   type: object
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   example: {}
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
 *
 */

router.route("/update-password").post(authController.protect, usersController.updatePasswordUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng nhập user
 *     description: Đăng nhập user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "muradvn2003@gmail.com"
 *               password:
 *                 type: string
 *                 example: "thinh123"
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
 *                   example: "Đăng nhập thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                          _id:
 *                            type: string
 *                            example: "650d3f4f421ed24dc41454bb"
 *                          email:
 *                            type: string
 *                            example: "muradvn2003@gmail.com"
 *                          role:
 *                            type: string
 *                            example: "user"
 *                     tokens:
 *                       type: object
 *                       properties:
 *                          accessToken:
 *                            type: string
 *                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQyMjQsImV4cCI6MTY5NzA3ODIyNH0.S4JFJpuR98CLXRY_H059AQ3l3jp3Rp-YV3tixRaOq6c"
 *                          refreshToken:
 *                            type: string
 *                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQyMjQsImV4cCI6MTY5ODgwNjIyNH0.x-qbhvQ1xMUhB88G7P9xnWS0UDrH1stUApfa2QHrcDU"
 *                          expireAccessToken:
 *                            type: integer
 *                            example: 1697078224424
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */
router.route("/login").post(usersController.loginUser);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     tags:
 *       - Users
 *     summary: Refresh token user
 *     description: Refresh token user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQzNTcsImV4cCI6MTY5ODgwNjM1N30.Kkbp5VEF4NGI17v4kdlbVjtLP931WZWq6d3ALd5DyFE"
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
 *                     tokens:
 *                       type: object
 *                       properties:
 *                          accessToken:
 *                            type: string
 *                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQyMjQsImV4cCI6MTY5NzA3ODIyNH0.S4JFJpuR98CLXRY_H059AQ3l3jp3Rp-YV3tixRaOq6c"
 *                          refreshToken:
 *                            type: string
 *                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQyMjQsImV4cCI6MTY5ODgwNjIyNH0.x-qbhvQ1xMUhB88G7P9xnWS0UDrH1stUApfa2QHrcDU"
 *                          expireAccessToken:
 *                            type: integer
 *                            example: 1697078224424
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 */
router.route("/refresh-token").post(usersController.handleRefreshToken);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng xuất user
 *     description: Đăng xuất user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQzNTcsImV4cCI6MTY5ODgwNjM1N30.Kkbp5VEF4NGI17v4kdlbVjtLP931WZWq6d3ALd5DyFE"
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
 *                   example: "Đăng xuất thành công"
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
 *
 */
router.route("/logout").post(authController.protect, usersController.logoutUser);

/**
 * @swagger
 * /users/send-reset-password-otp:
 *   post:
 *     tags:
 *       - Users
 *     summary: Gửi reset password OTP
 *     description: Gửi reset password OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "muradvn2003@gmail.com"
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
 *                   example: "Gửi mã OTP thành công"
 *                 data:
 *                   type: object
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 *
 */
router.route("/send-reset-password-otp").post(usersController.sendResetPasswordOTP);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Auto reset password
 *     description: Auto reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "muradvn2003@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "472689"
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
 *                   example: "Reset mật khẩu thành công, mật khẩu mới đã được gửi về email của bạn"
 *                 data:
 *                   type: object
 *                   example: null
 *                 metadata:
 *                   type: object
 *                   example: {}
 *
 *
 */
router.route("/reset-password").post(usersController.resetPassword);

// User Addresses Routers
router.use("/addresses", userAddressRouters);

module.exports = router;
