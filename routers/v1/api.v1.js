const express = require("express");
const userRouters = require("./users.routers");
const productSalesRouters = require("./product.sales.routers");
const productSizesRouters = require("./product.sizes.routers");
const productColorsRouters = require("./product.colors.routers");
const productCategoriesRouters = require("./product.categories.routers");
const productReviewsRouters = require("./product.reviews.routers");
const favoriteProductsRouters = require("./favorite.products.routers");
const productsRouters = require("./products.routers");
const vouchersRouters = require("./vouchers.routers");
const cartsRouters = require("./carts.routers");
const ordersRouters = require("./orders.routers");
const uploadRouters = require("./upload.routers");
const adminRouters = require("./admins.routers");
const notificationsRouters = require("./notifications.routers");
const searchRouters = require("./search.routers");

const router = express.Router();
router.use("/admins", adminRouters);
router.use("/uploads", uploadRouters);
router.use("/orders", ordersRouters);
router.use("/carts", cartsRouters);
router.use("/vouchers", vouchersRouters);
router.use("/users", userRouters);
router.use("/products", productsRouters);
router.use("/product-sales", productSalesRouters);
router.use("/product-sizes", productSizesRouters);
router.use("/product-colors", productColorsRouters);
router.use("/product-categories", productCategoriesRouters);
router.use("/product-reviews", productReviewsRouters);
router.use("/favorite-products", favoriteProductsRouters);
router.use("/search", searchRouters);
router.use("/notifications", notificationsRouters);

module.exports = router;
