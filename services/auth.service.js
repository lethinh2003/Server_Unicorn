"use strict";

const { UnauthorizedError, BadRequestError, NotFoundError } = require("../utils/app_error");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const KeyRepository = require("../models/repositories/key.repository");
const { validateUserToken } = require("../utils/authUtils");

class AuthService {
  static protect = async ({ userId, accessToken }) => {
    if (!userId) {
      throw new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED);
    }
    const keyStore = await KeyRepository.findOne({
      query: {
        user: userId,
      },
    });
    if (!keyStore) {
      throw new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED);
    }
    if (!accessToken || !accessToken.startsWith("Bearer")) {
      throw new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED);
    }
    const getJWTToken = accessToken.split(" ")[1];
    const user = await validateUserToken({ accessToken: getJWTToken, publicKey: keyStore.public_key, userId });
    return { user, keyStore };
  };

  static reStrictTo = async ({ roles, userRole }) => {
    if (!roles.includes(userRole)) {
      throw new UnauthorizedError(USER_MESSAGES.AUTHORIZED_REQUIRE);
    }
    return true;
  };

  ///
}
module.exports = AuthService;
