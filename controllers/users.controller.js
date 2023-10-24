"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const KeysService = require("../services/keys.service");
const UsersService = require("../services/users.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { comparePassword, hashPassword } = require("../utils/hashPassword");
const { selectFields } = require("../utils/selectFields");
const { CreatedResponse, OkResponse } = require("../utils/success_response");
const crypto = require("crypto");
const { createToken } = require("../utils/authUtils");
const sendMail = require("../utils/email");

class UsersController {
  getInformationUser = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const result = await UsersService.findById({ _id });

    return new OkResponse({
      data: selectFields({ fields: ["email", "name", "birthday", "gender", "phone_number"], object: result }),
    }).send(res);
  });
  updateInformationUser = catchAsync(async (req, res, next) => {
    const { birthday, gender, name, phone_number } = req.body;
    const { _id } = req.user;
    if (!birthday || !gender || !phone_number || !name) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    const result = await UsersService.updateInformationUser({ birthday, gender, name, phone_number, _id });

    return new OkResponse({
      message: USER_MESSAGES.UPDATE_INFORMATION_SUCCESS,
    }).send(res);
  });
  updatePasswordUser = catchAsync(async (req, res, next) => {
    const { current_password, new_password } = req.body;
    const { _id, password: userPassword } = req.user;
    if (!current_password || !new_password) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    if (current_password === new_password) {
      return next(new UnauthorizedError(USER_MESSAGES.CURRENT_PASSWORD_IS_EQUAL_NEW_PASSWORD));
    }
    // check current password is match
    const validatePassword = await comparePassword(current_password, userPassword);
    if (!validatePassword) {
      return next(new UnauthorizedError(USER_MESSAGES.CURRENT_PASSWORD_COMPARE_INVALID));
    }

    // change password
    await UsersService.updatePasswordUser({
      new_password: await hashPassword(new_password),
      _id,
    });
    return new OkResponse({
      message: USER_MESSAGES.UPDATE_PASSWORD_SUCCESS,
    }).send(res);
  });

  createUser = catchAsync(async (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check email is exist
    const findUser = await UsersService.findByEmail({ email });
    if (findUser) {
      return next(new BadRequestError(USER_MESSAGES.EMAIL_EXIST_DB));
    }
    const result = await UsersService.createUser({ email, password, name });

    return new CreatedResponse({
      message: USER_MESSAGES.SIGNUP_SUCCESS,
      data: selectFields({ fields: ["email", "name"], object: result }),
    }).send(res);
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

    return new OkResponse({
      message: USER_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: selectFields({ fields: ["_id", "email", "role"], object: user }),
        tokens: { accessToken, refreshToken, expireAccessToken },
      },
    }).send(res);
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

  sendResetPasswordOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check email is exist
    const findUser = await UsersService.findByEmail({ email });
    if (!findUser) {
      return next(new NotFoundError(USER_MESSAGES.EMAIL_NOT_EXIST_DB));
    }
    // Check time send OTP > 10 min
    if (Date.now() - new Date(findUser.time_reset_password_otp) < 10 * 60 * 1000) {
      return next(new UnauthorizedError(USER_MESSAGES.SEND_RESET_PASSWORD_OTP_TIME_FAILED));
    }
    // Create OTP (6 bytes)
    const otp = crypto
      .randomInt(0, 10 ** 6 - 1)
      .toString()
      .padStart(6, "0");

    // Update OTP in DB
    const updateOTP = UsersService.createOTPResetPassword({
      email,
      otp,
    });
    // Send OTP to email
    const sendOTP = sendMail({
      email: email,
      subject: "Mã OTP khôi phục mật khẩu UniCorn",
      text: `Mã OTP khôi phục mật khẩu UniCorn của bạn là: ${otp}. Mã này chỉ có thời hạn trong 10 phút kể từ khi được gửi`,
      mesage: `Mã OTP khôi phục mật khẩu UniCorn của bạn là: ${otp}. Mã này chỉ có thời hạn trong 10 phút kể từ khi được gửi`,
    });
    await Promise.all([updateOTP, sendOTP]);

    return new OkResponse({
      message: USER_MESSAGES.SEND_RESET_PASSWORD_OTP_SUCCESS,
    }).send(res);
  });
  resetPassword = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check email & OTP is exist
    const findUser = await UsersService.findUserByOTPResetPassword({ email, otp });
    if (!findUser) {
      return next(new NotFoundError(USER_MESSAGES.EMAIL_OR_OTP_NOT_EXIST_DB));
    }
    // Check time OTP expried?
    if (Date.now() - new Date(findUser.time_reset_password_otp) >= 10 * 60 * 1000) {
      return next(new UnauthorizedError(USER_MESSAGES.OTP_EXPRIED_IN_DB));
    }
    // Random new pasword
    const newPassword = crypto.randomBytes(8).toString("hex");
    // Update user in DB
    await UsersService.updatePassword({ email, password: newPassword });
    await UsersService.resetPasswordOTP({ email });
    // Send OTP to email
    const sendOTP = await sendMail({
      email: email,
      subject: "Bạn đã thay đổi mật khẩu UniCorn",
      text: `Mật khẩu mới của bạn là: ${newPassword}.`,
      mesage: `Mật khẩu mới của bạn là: ${newPassword}.`,
    });

    return new OkResponse({
      message: USER_MESSAGES.RESET_PASSWORD_SUCCESS,
    }).send(res);
  });
}

module.exports = new UsersController();
