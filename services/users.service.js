"use strict";

const Users = require("../models/Users");
const ProductSizes = require("../models/ProductSizes");
const ProductColors = require("../models/ProductColors");

class UsersService {
  static createUser = async ({ email, password, name }) => {
    const user = await Users.create({
      email,
      password,
      name,
    });
    return user;
  };
  static findByEmail = async ({ email }) => {
    await ProductColors.findOne({});
    const user = await Users.findOne({
      email,
    }).lean();
    return user;
  };
  static createOTPResetPassword = async ({ email, otp }) => {
    const result = await Users.findOneAndUpdate(
      {
        email,
      },
      {
        reset_password_otp: otp,
        time_reset_password_otp: new Date(Date.now()),
      }
    );
    return result;
  };
  static findUserByOTPResetPassword = async ({ email, otp }) => {
    const result = await Users.findOne({
      email,
      reset_password_otp: otp,
    }).lean();
    return result;
  };
  static updatePassword = async ({ email, password }) => {
    const result = await Users.findOne({
      email,
    });
    result.password = password;
    await result.save();

    return result;
  };
  static resetPasswordOTP = async ({ email }) => {
    const result = await Users.findOneAndUpdate(
      {
        email,
      },
      {
        reset_password_otp: undefined,
        time_reset_password_otp: undefined,
      }
    );
    return result;
  };
}
module.exports = UsersService;
