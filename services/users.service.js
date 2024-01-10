"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");

const UserRepository = require("../models/repositories/user.repository");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../utils/app_error");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const KeyRepository = require("../models/repositories/key.repository");
const crypto = require("crypto");
const { createToken } = require("../utils/authUtils");
const { selectFields } = require("../utils/selectFields");
const mongoose = require("mongoose");
const EmailService = require("./email.service");

class UsersService {
  static getInformationUser = async ({ _id }) => {
    const query = {
      _id,
    };
    const select = "email name birthday gender phone_number";

    const user = await UserRepository.findOne({ query, select });
    return user;
  };
  static createUser = async ({ email, password, name }) => {
    if (!email || !password || !name) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check email is exist
    const findUser = await UserRepository.findOne({ query: { email } });
    if (findUser) {
      throw new BadRequestError(USER_MESSAGES.EMAIL_EXIST_DB);
    }
    const user = await UserRepository.createOne({ data: { email, password, name } });
    return selectFields({ fields: ["email", "name"], object: user });
  };
  static updateInformationUser = async ({ birthday, gender, name, phone_number, _id }) => {
    if (!birthday || !gender || !phone_number || !name) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const user = await UserRepository.findOneAndUpdate({
      query: { _id },
      update: { birthday, gender, name, phone_number },
      select: "email name birthday gender phone_number",
      options: {
        runValidators: true,
        new: true,
      },
    });
    return user;
  };
  static updatePasswordUser = async ({ current_password, new_password, _id, userPassword }) => {
    if (!current_password || !new_password) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    if (current_password === new_password) {
      throw new UnauthorizedError(USER_MESSAGES.CURRENT_PASSWORD_IS_EQUAL_NEW_PASSWORD);
    }
    // check current password is match
    const validatePassword = await comparePassword(current_password, userPassword);
    if (!validatePassword) {
      throw new UnauthorizedError(USER_MESSAGES.CURRENT_PASSWORD_COMPARE_INVALID);
    }

    // change password
    const user = await UserRepository.findOneAndUpdate({
      query: { _id },
      update: { password: await hashPassword(new_password) },
      options: {
        runValidators: true,
        new: true,
      },
    });

    return user;
  };
  static loginUser = async ({ email, password }) => {
    if (!email || !password) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check email is exist
    const user = await UserRepository.findOne({ query: { email } });
    if (!user) {
      throw new NotFoundError(USER_MESSAGES.EMAIL_NOT_EXIST_DB);
    }
    // Validate password
    const validatePassword = await comparePassword(password, user.password);
    if (!validatePassword) {
      throw new UnauthorizedError(USER_MESSAGES.PASSWORD_COMPARE_INVALID);
    }
    // Check key is exist in dbs?
    const findKeyStore = await KeyRepository.findOne({
      query: { user: user._id },
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
    const generateKey = await KeyRepository.findOneAndUpdate({
      query: {
        user: user._id,
      },
      update: {
        $push: { refresh_tokens: refreshToken },
        private_key: privateKey,
        public_key: publicKey,
      },
      options: {
        upsert: true,
        new: true,
      },
    });
    return {
      user: selectFields({ fields: ["_id", "email", "role"], object: user }),
      tokens: { accessToken, refreshToken, expireAccessToken },
    };
  };
  static handleRefreshToken = async ({ refreshToken }) => {
    if (!refreshToken) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }

    // Check refresh_token in black list (refresh_tokens_used)
    const checkTokenUsed = await KeyRepository.findOne({
      query: {
        refresh_tokens_used: refreshToken,
      },
    });

    if (checkTokenUsed) {
      // Delete current Keys -> Log out user
      await KeyRepository.findOneAndDelete({
        query: {
          _id: checkTokenUsed._id,
        },
      });
      throw new BadRequestError(USER_MESSAGES.COMMON_HACKED_ERROR);
    }

    // Find Key store current refresh_token
    const findKeyStore = await KeyRepository.findOne({
      query: {
        refresh_tokens: refreshToken,
      },
      populate: "user",
    });
    if (!findKeyStore) {
      throw new BadRequestError(USER_MESSAGES.COMMON_HACKED_ERROR);
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
    await KeyRepository.findOneAndUpdate({
      query: {
        _id: findKeyStore._id,
      },
      update: {
        $push: {
          refresh_tokens: newRefreshToken,
          refresh_tokens_used: refreshToken,
        },
      },
    });
    // Remove current refresh_token

    await KeyRepository.findOneAndUpdate({
      query: {
        _id: findKeyStore._id,
      },
      update: {
        $pull: {
          refresh_tokens: refreshToken,
        },
      },
    });

    return {
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
        expireAccessToken,
      },
    };
  };
  static logoutUser = async ({ refreshToken, _id }) => {
    if (!refreshToken) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }

    // Delete current refresh_token in DB
    await KeyRepository.findOneAndUpdate({
      query: {
        user: _id,
      },
      update: {
        $pull: { refresh_tokens: refreshToken },
      },
      options: {
        upsert: false,
        new: true,
      },
    });
  };
  static sendResetPasswordOTP = async ({ email }) => {
    if (!email) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const session = await mongoose.startSession();
    const options = { session };

    await session.withTransaction(async () => {
      try {
        // Check email is exist
        const findUser = await UserRepository.findOne({ query: { email } });
        if (!findUser) {
          throw new NotFoundError(USER_MESSAGES.EMAIL_NOT_EXIST_DB);
        }
        // Check time send OTP > 10 min
        if (Date.now() - new Date(findUser.time_reset_password_otp) < 10 * 60 * 1000) {
          throw new UnauthorizedError(USER_MESSAGES.SEND_RESET_PASSWORD_OTP_TIME_FAILED);
        }
        // Create OTP (6 bytes)
        const otp = crypto
          .randomInt(0, 10 ** 6 - 1)
          .toString()
          .padStart(6, "0");

        // Update OTP in DB
        const updateOTP = UserRepository.findOneAndUpdate({
          query: {
            email,
          },
          update: {
            reset_password_otp: otp,
            time_reset_password_otp: new Date(Date.now()),
          },
          options,
        });

        // Send OTP to email
        const sendOTP = EmailService.sendOTPResetPassword({ email, otp });
        await Promise.all([updateOTP, sendOTP]);

        await session.commitTransaction();
        return true;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    });
  };
  static resetPassword = async ({ email, otp }) => {
    if (!email || !otp) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const session = await mongoose.startSession();
    const options = { session };

    await session.withTransaction(async () => {
      try {
        // Check email & OTP is exist
        const findUser = await UserRepository.findOne({
          query: {
            email,
            reset_password_otp: otp,
          },
        });
        if (!findUser) {
          throw new NotFoundError(USER_MESSAGES.EMAIL_OR_OTP_NOT_EXIST_DB);
        }
        // Check time OTP expried?
        if (Date.now() - new Date(findUser.time_reset_password_otp) >= 10 * 60 * 1000) {
          throw new UnauthorizedError(USER_MESSAGES.OTP_EXPRIED_IN_DB);
        }
        // Random new pasword
        const newPassword = crypto.randomBytes(8).toString("hex");
        // Update user in DB
        const updateUser = UserRepository.findOneAndUpdate({
          query: { email },
          update: { password: newPassword, reset_password_otp: undefined, time_reset_password_otp: undefined },
          options,
        });
        // Send OTP to email
        const sendOTP = EmailService.sendOTPNewPassword({ email, newPassword });
        await Promise.all([updateUser, sendOTP]);

        await session.commitTransaction();
        return true;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    });
  };

  //////
}
module.exports = UsersService;
