const express = require("express");
const productCategoriesController = require("../../controllers/product.categories.controller");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

// router.route("/parents").get(productCategoriesController.getAllParentCategoriesByGender);

/**
 * @swagger
 * /product-categories:
 *   get:
 *     tags:
 *       - Products
 *     summary: Lấy thông tin tất cả danh mục sản phẩm
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         required: true
 *         default: "men"
 *         description: "Loại đồ: men (nam) || women (nữ) || unisex (cả 2)"
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
 *                         example: "650ebe49baa58c5aece0d7ed"
 *                         description: ID của danh mục sản phẩm
 *                       status:
 *                         type: boolean
 *                         example: true
 *                         description: Trạng thái của danh mục sản phẩm
 *                       product_category_name:
 *                         type: string
 *                         example: "Áo"
 *                         description: Tên của danh mục sản phẩm
 *                       product_category_keyword:
 *                         type: string
 *                         example: "tops"
 *                         description: Keyword của danh mục sản phẩm
 *                       createdAt:
 *                         type: string
 *                         example: "2023-09-23T10:30:33.702Z"
 *                         description: Thời gian tạo danh mục sản phẩm
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-01-10T07:28:55.061Z"
 *                         description: Thời gian cập nhật danh mục sản phẩm
 *                       product_category_gender:
 *                         type: string
 *                         example: "unisex"
 *                         description: Giới tính của danh mục sản phẩm
 *                       product_category_image:
 *                         type: string
 *                         format: uri
 *                         example: "https://image.uniqlo.com/UQ/ST3/us/imagesother/Navigation/460943_353F002C_22_A010_S_NAVI.jpg"
 *                         description: Đường dẫn ảnh của danh mục sản phẩm
 *                       product_category_parent_id:
 *                         type: string
 *                         example: null
 *                         description: ID của danh mục sản phẩm cha (nếu có)
 *                       child_categories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "650ebeb5baa58c5aece0d7ef"
 *                               description: ID của danh mục con
 *                             status:
 *                               type: boolean
 *                               example: true
 *                               description: Trạng thái của danh mục con
 *                             product_category_parent_id:
 *                               type: string
 *                               example: "650ebe49baa58c5aece0d7ed"
 *                               description: ID của danh mục cha
 *                             product_category_name:
 *                               type: string
 *                               example: "Áo Thun"
 *                               description: Tên của danh mục con
 *                             product_category_keyword:
 *                               type: string
 *                               example: "t-shirts"
 *                               description: Keyword của danh mục con
 *                             createdAt:
 *                               type: string
 *                               example: "2023-09-23T10:32:21.726Z"
 *                               description: Thời gian tạo danh mục con
 *                             updatedAt:
 *                               type: string
 *                               example: "2023-12-19T17:45:37.407Z"
 *                               description: Thời gian cập nhật danh mục con
 *                             product_category_gender:
 *                               type: string
 *                               example: "unisex"
 *                               description: Giới tính của danh mục con
 *                             product_category_image:
 *                               type: string
 *                               format: uri
 *                               example: "https://res.cloudinary.com/dkjjr9xra/image/upload/v1703007936/unicorn/8GPbUoA_6137959.jpg"
 *                               description: Đường dẫn ảnh của danh mục con
 *                   description: Danh sách các danh mục sản phẩm
 *                 metadata:
 *                   type: object
 *                   example:
 *                     gender: "men"
 *
 */
router.route("/").get(productCategoriesController.getAllCategoriesByGender);

// router.route("/list-child").get(productCategoriesController.getChildCategories);

module.exports = router;
