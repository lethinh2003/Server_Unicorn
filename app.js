const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
dotenv.config({ path: "./config.env" });
const path = require("path");
const app = express();
const { NotFoundError } = require("./utils/app_error");
const {
  endpoint: { client },
} = require("./configs/config.endpoint");
const errorController = require("./controllers/error_controller");
const { UPLOAD_PATH } = require("./configs/config.upload.path");
const userRouters = require("./routers/users.routers");
const productSalesRouters = require("./routers/product.sales.routers");
const productSizesRouters = require("./routers/product.sizes.routers");
const productColorsRouters = require("./routers/product.colors.routers");
const productCategoriesRouters = require("./routers/product.categories.routers");
const productReviewsRouters = require("./routers/product.reviews.routers");
const favoriteProductsRouters = require("./routers/favorite.products.routers");
const productsRouters = require("./routers/products.routers");
const vouchersRouters = require("./routers/vouchers.routers");
const cartsRouters = require("./routers/carts.routers");
const ordersRouters = require("./routers/orders.routers");
const uploadRouters = require("./routers/upload.routers");
const adminRouters = require("./routers/admins.routers");

const cors = require("cors");
const { convertDateTime } = require("./utils/convertTime");
const compression = require("compression");
//MIDDLEWARE
app.use(cors());
app.options(client, cors());
//security http
app.use(helmet());
app.use(compression());

//limit request
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 1000,
  message: "Quá nhiều yêu cầu từ hệ thống, vui lòng thử lại sau 1 phút nữa",
});
app.use("/api", limiter);

///// body parser in , reading data from body
app.use(express.json());

//against NoSQL Injection
app.use(mongoSanitize());

//against XSS (HTML, JS)

app.use(xss());

//test middleware
app.use((req, res, next) => {
  req.timeNow = new Date().toISOString();
  next();
});
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Unicorn API",
      version: "1.0.0",
      description: "API dành cho Unicorn - Trang web bán quần áo thời trang",
      contact: {
        name: "Le Thinh",
        url: "https://lethinh-blog.site",
      },
    },
    servers: [
      {
        url: `http://localhost:8084/api/v1`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Điền access token vào đây",
        },
        clientIdAuth: {
          type: "apiKey",
          name: "X-client-id",
          in: "header",
          description: "Điền id của user vào đây",
        },
      },
    },
  },
  apis: ["./routers/*.routers.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
const customSiteTitle = "Tài liệu Unicorn API";

//routers
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, {
    customSiteTitle,
  })
);
app.use("/public/uploads", express.static(path.join(__dirname, UPLOAD_PATH.PRIMARY_DIR)));
app.use("/api/v1/admins", adminRouters);
app.use("/api/v1/uploads", uploadRouters);
app.use("/api/v1/orders", ordersRouters);
app.use("/api/v1/carts", cartsRouters);
app.use("/api/v1/vouchers", vouchersRouters);
app.use("/api/v1/users", userRouters);
app.use("/api/v1/products", productsRouters);
app.use("/api/v1/product-sales", productSalesRouters);
app.use("/api/v1/product-sizes", productSizesRouters);
app.use("/api/v1/product-colors", productColorsRouters);
app.use("/api/v1/product-categories", productCategoriesRouters);
app.use("/api/v1/product-reviews", productReviewsRouters);
app.use("/api/v1/favorite-products", favoriteProductsRouters);
app.use("/IPN", require("./routers/vnpay.routers"));
app.use("/api/v1/search", require("./routers/search.routers"));

app.all("*", (req, res, next) => {
  next(new NotFoundError(`No found ${req.originalUrl}`));
});

app.use(errorController);
module.exports = app;
