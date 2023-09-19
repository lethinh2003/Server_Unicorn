const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
dotenv.config({ path: "./config.env" });
const app = express();
const { NotFoundError } = require("./utils/app_error");
const {
  endpoint: { client },
} = require("./configs/config.endpoint");
const errorController = require("./controllers/error_controller");
const userRouters = require("./routers/users.routers");

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

//serving static file
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.timeNow = new Date().toISOString();
  next();
});

//routers
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
app.use("/api/v1/users", userRouters);

app.all("*", (req, res, next) => {
  next(new NotFoundError(`No found ${req.originalUrl}`));
});

app.use(errorController);
module.exports = app;
