"use strict";

const Users = require("../models/Users");

class UsersService {
  static updatePasswordUser = async ({ new_password, _id }) => {
    const user = await Users.findOneAndUpdate(
      { _id },
      {
        password: new_password,
      }
    );
    return user;
  };
  static updateInformationUser = async ({ birthday, gender, name, phone_number, _id }) => {
    const user = await Users.findOneAndUpdate(
      { _id },
      {
        birthday,
        gender,
        name,
        phone_number,
      },
      {
        runValidators: true,
      }
    );
    return user;
  };
  static createUser = async ({ email, password, name }) => {
    const user = await Users.create({
      email,
      password,
      name,
    });
    return user;
  };
  static deleteById = async ({ userId, options = {} }) => {
    const user = await Users.deleteOne({
      _id: userId,
    }).session(options?.session);
    return user;
  };
  static findById = async ({ _id }) => {
    const user = await Users.findOne({
      _id,
    }).lean();
    return user;
  };
  static findByEmail = async ({ email }) => {
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
