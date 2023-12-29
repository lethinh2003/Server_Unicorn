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
  endpoint: { client, server },
} = require("./configs/config.endpoint");
const errorController = require("./controllers/error_controller");
const { UPLOAD_PATH } = require("./configs/config.upload.path");

const cors = require("cors");
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
  validate: { xForwardedForHeader: false },
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
        url: `${server}/api/v1`,
        description: "API v1",
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
  apis: ["./routers/v1/*.routers.js"],
};

const openapiSpecification = swaggerJsdoc(options);
const customSiteTitle = "Tài liệu Unicorn API V1";

//routers
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use(
  "/docs/v1",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, {
    customSiteTitle,
  })
);
app.use("/public/uploads", express.static(path.join(__dirname, UPLOAD_PATH.PRIMARY_DIR)));

app.use("/IPN", require("./routers/vnpay.routers"));
app.use("/api/v1", require("./routers/v1/api.v1"));

app.all("*", (req, res, next) => {
  next(new NotFoundError(`No found ${req.originalUrl}`));
});

app.use(errorController);
module.exports = app;
