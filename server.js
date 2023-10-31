const dotenv = require("dotenv");
const SocketServices = require("./services/socket.service");
const http = require("http");
const app = require("./app");
const jwt = require("jsonwebtoken");

const {
  endpoint: { client },
} = require("./configs/config.endpoint");
const KeysService = require("./services/keys.service");
const server = http.createServer(app);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log("Error: ", err);
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

// Database connection
require("./dbs/init.mongodb");

const port = process.env.PORT || 8084;
const io = require("socket.io")(server, {
  cors: {
    origin: client,
  },
});
global._io = io;
global._io.use(async (socket, next) => {
  const authToken = socket.handshake.auth.token;
  const userId = socket.handshake.auth.userId;

  try {
    if (!userId) {
      throw new Error("Đăng nhập để tiếp tục");
    }
    if (!authToken || !authToken.startsWith("Bearer")) {
      throw new Error("Đăng nhập để tiếp tục");
    }
    let accessToken = authToken.split(" ")[1];

    const keyStore = await KeysService.findByUserID({ userId });
    if (!keyStore) {
      throw new Error("Đăng nhập để tiếp tục");
    }
    const decode = jwt.verify(accessToken, keyStore.publicKey);
    if (decode.id.toString() !== userId.toString()) {
      throw new Error("Đăng nhập để tiếp tục");
    }

    global._io.role = decode.role;
    socket.join(`${decode.taiKhoan}`);
    console.log("ROOM:", global._io.sockets.adapter.rooms);
    next();
  } catch (err) {
    console.log(err);
    if (err.message) {
      return next(new Error(err.message));
    }
  }
});
global._io.on("connection", SocketServices.connection);

server.listen(port, () => {
  console.log("Server đang chay tren cong", port);
  console.log("http://localhost:" + port);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log("Error: ", err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
