"use strict";

const { UnauthorizedError, BadRequestError, NotFoundError } = require("../utils/app_error");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const { USER_MESSAGES } = require("../configs/config.user.messages");

class AuthService {
  static validateToken = async ({ accessToken, publicKey, userId, next }) => {
    const decode = jwt.verify(accessToken, publicKey);
    if (decode.id.toString() !== userId.toString()) {
      return next(new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED));
    }
    const user = await Users.findOne({ _id: decode.id });
    if (!user) {
      return next(new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED));
    }
    return user;
  };
  static isPermission = ({ roles, userRole, next }) => {
    if (!roles.includes(userRole)) {
      return next(new UnauthorizedError(USER_MESSAGES.AUTHORIZED_REQUIRE));
    }
    return true;
  };
}
module.exports = AuthService;
