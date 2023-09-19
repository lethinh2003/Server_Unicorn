"use strict";

const Users = require("../models/Users");

class UsersService {
  static createUser = async ({ email, password, birthday, gender }) => {
    const user = await Users.create({
      email,
      password,
      birthday,
      gender,
    });
    return user;
  };
  static findByEmail = async ({ email }) => {
    const user = await Users.findOne({
      email,
    });
    return user;
  };
}
module.exports = UsersService;
