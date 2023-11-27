"use strict";

const Orders = require("../models/Orders");
const Users = require("../models/Users");

class AdminsService {
  static findUsers = async ({ limitItems, skipItems }) => {
    const users = await Users.find({}).skip(skipItems).limit(limitItems).lean();
    return users;
  };
  static findOrders = async ({ limitItems, skipItems }) => {
    const users = await Orders.find({}).skip(skipItems).limit(limitItems).lean().populate("user");
    return users;
  };
  static findDetailUserById = async ({ userId }) => {
    const user = await Users.findOne({ _id: userId }).lean();
    return user;
  };
  static createUser = async ({ email, password, birthday, gender, name, phone_number, status, role }) => {
    const user = await Users.create({
      email,
      password,
      birthday,
      gender,
      name,
      phone_number,
      status,
      role,
    });
    return user;
  };
  static updateUser = async ({ userId, email, password, birthday, gender, name, phone_number, status, role }) => {
    const user = await Users.findOneAndUpdate(
      { _id: userId, email: email },
      {
        password,
        birthday,
        gender,
        name,
        phone_number,
        status,
        role,
      },
      {
        runValidators: true,
      }
    );
    return user;
  };
  static countAllUsers = async () => {
    const count = await Users.countDocuments({});
    return count;
  };
  static countAllOrders = async () => {
    const count = await Orders.countDocuments({});
    return count;
  };
}
module.exports = AdminsService;
