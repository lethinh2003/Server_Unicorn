"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const UsersService = require("../services/users.service");
const catchAsync = require("../utils/catch_async");
const { CreatedResponse, OkResponse } = require("../utils/success_response");

class UsersController {
  getInformationUser = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const user = await UsersService.getInformationUser({ _id });

    return new OkResponse({
      data: user,
    }).send(res);
  });
  updateInformationUser = catchAsync(async (req, res, next) => {
    const { birthday, gender, name, phone_number } = req.body;
    const { _id } = req.user;

    const result = await UsersService.updateInformationUser({ birthday, gender, name, phone_number, _id });
    return new OkResponse({
      message: USER_MESSAGES.UPDATE_INFORMATION_SUCCESS,
      data: result,
    }).send(res);
  });
  updatePasswordUser = catchAsync(async (req, res, next) => {
    const { current_password, new_password } = req.body;
    const { _id, password: userPassword } = req.user;
    // change password
    await UsersService.updatePasswordUser({
      current_password,
      new_password,
      _id,
      userPassword,
    });
    return new OkResponse({
      message: USER_MESSAGES.UPDATE_PASSWORD_SUCCESS,
    }).send(res);
  });

  createUser = catchAsync(async (req, res, next) => {
    const { email, password, name } = req.body;

    return new CreatedResponse({
      message: USER_MESSAGES.SIGNUP_SUCCESS,
      data: await UsersService.createUser({ email, password, name }),
    }).send(res);
  });

  loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    return new OkResponse({
      message: USER_MESSAGES.LOGIN_SUCCESS,
      data: await UsersService.loginUser({ email, password }),
    }).send(res);
  });
  handleRefreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    return new OkResponse({
      data: await UsersService.handleRefreshToken({ refreshToken }),
    }).send(res);
  });
  logoutUser = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const { refreshToken } = req.body;

    await UsersService.logoutUser({
      _id,
      refreshToken,
    });
    return new OkResponse({
      message: USER_MESSAGES.LOGOUT_SUCCESS,
    }).send(res);
  });

  sendResetPasswordOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    await UsersService.sendResetPasswordOTP({ email });
    return new OkResponse({
      message: USER_MESSAGES.SEND_RESET_PASSWORD_OTP_SUCCESS,
    }).send(res);
  });
  resetPassword = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    await UsersService.resetPassword({ email, otp });
    return new OkResponse({
      message: USER_MESSAGES.RESET_PASSWORD_SUCCESS,
    }).send(res);
  });
}

module.exports = new UsersController();
