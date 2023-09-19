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
    // Check email is exist
    const findUser = await UsersService.findByEmail({ email });
    if (findUser) {
      return next(new BadRequestError(USER_MESSAGES.EMAIL_EXIST_DB));
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

    return new OkResponse({ message: USER_MESSAGES.LOGIN_SUCCESS, data: { token: { accessToken, refreshToken, expireAccessToken } } }).send(
      res
    );
  });
  handleRefreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }

    // Check refresh_token in black list (refresh_tokens_used)
    const checkTokenUsed = await KeysService.findByRefreshTokensUsed({
      refreshToken,
    });
    if (checkTokenUsed) {
      // Delete current Keys -> Log out user
      await KeysService.deleteByID({
        ID: checkTokenUsed._id,
      });
      return next(new BadRequestError(USER_MESSAGES.COMMON_HACKED_ERROR));
    }

    // Find Key store current refresh_token
    const findKeyStore = await KeysService.findByRefreshToken({
      refreshToken,
    });
    if (!findKeyStore) {
      return next(new BadRequestError(USER_MESSAGES.COMMON_HACKED_ERROR));
    }

    // Create new access_token, refresh_token from current key secret
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expireAccessToken,
    } = createToken({
      payload: { email: findKeyStore.user.email, role: findKeyStore.user.role, id: findKeyStore.user._id.toString() },
      publicKey: findKeyStore.public_key,
      privateKey: findKeyStore.private_key,
    });
    // Update refresh_token to DB
    await findKeyStore.update({
      $push: {
        refresh_tokens: newRefreshToken,
        refresh_tokens_used: refreshToken,
      },
    });
    // Remove current refresh_token
    await findKeyStore.update({
      $pull: {
        refresh_tokens: refreshToken,
      },
    });

    return new OkResponse({
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expireAccessToken,
        },
      },
    }).send(res);
  });
  logoutUser = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Delete current refresh_token in DB
    await KeysService.deleteByUserIdAndRT({
      userId: user._id,
      refreshToken,
    });
    return new OkResponse({
      message: USER_MESSAGES.LOGOUT_SUCCESS,
    }).send(res);
  });
}

module.exports = new UsersController();
