"use strict";

const mongoose = require("mongoose");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const KeysService = require("../services/keys.service");
const UsersService = require("../services/users.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { comparePassword } = require("../utils/hashPassword");
const { selectFields } = require("../utils/selectFields");
const { CreatedResponse, OkResponse } = require("../utils/success_response");
const crypto = require("crypto");
const { createToken } = require("../utils/authUtils");

class UsersController {
  createUser = catchAsync(async (req, res, next) => {
    const { email, password, birthday, gender } = req.body;
    if (!email || !password || !birthday || !gender) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    const result = await UsersService.createUser({ email, password, birthday, gender });

    return new CreatedResponse({ message: USER_MESSAGES.SIGNUP_SUCCESS, data: selectFields({ fields: ["email"], object: result }) }).send(
      res
    );
  });
  loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check email is exist
    const user = await UsersService.findByEmail({ email });
    if (!user) {
      return next(new NotFoundError(USER_MESSAGES.EMAIL_NOT_EXIST_DB));
    }
    // Validate password
    const validatePassword = await comparePassword(password, user.password);
    if (!validatePassword) {
      return next(new UnauthorizedError(USER_MESSAGES.PASSWORD_COMPARE_INVALID));
    }
    // Check key is exist in dbs?
    const findKeyStore = await KeysService.findByUserID({
      userId: user._id,
    });

    let publicKey, privateKey;
    if (findKeyStore) {
      // Get key secret from db
      publicKey = findKeyStore.public_key;
      privateKey = findKeyStore.private_key;
    } else {
      // Create new key secret
      publicKey = crypto.randomBytes(64).toString("hex");
      privateKey = crypto.randomBytes(64).toString("hex");
    }
    // Create access_token and refresh_token
    const { accessToken, refreshToken, expireAccessToken } = createToken({
      payload: {
        email: user.email,
        role: user.role,
        id: user._id.toString(),
      },
      publicKey,
      privateKey,
    });
    // Store refresh_token and key to database
    const generateKey = await KeysService.createKeyPair({
      userID: user._id,
      refreshToken,
      publicKey,
      privateKey,
    });

    return new OkResponse({ message: USER_MESSAGES.LOGIN_SUCCESS, data: { accessToken, refreshToken, expireAccessToken } }).send(res);
  });
}

module.exports = new UsersController();
