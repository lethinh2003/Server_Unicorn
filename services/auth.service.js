"use strict";

const AppError = require("../utils/app_error");
const NguoiDung = require("../models/Users").default;
const jwt = require("jsonwebtoken");

class AuthService {
  static validateToken = async ({ accessToken, publicKey, userId }) => {
    const decode = jwt.verify(accessToken, publicKey);
    if (decode.id.toString() !== userId.toString()) {
      throw new AppError("Vui lòng đăng nhập để tiếp tục", 400);
    }
    const user = await NguoiDung.findOne({ _id: decode.id });
    if (!user) {
      throw new AppError("Vui lòng đăng nhập để tiếp tục", 400);
    }
    return user;
  };
  static isPermission = ({ roles, userRole }) => {
    if (!roles.includes(userRole)) {
      throw new AppError("Bạn không có quyền truy cập vào đây", 403);
    }
    return true;
  };
}
module.exports = AuthService;
