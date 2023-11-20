"use strict";

const Users = require("../models/Users");

class AdminsService {
  static findUsers = async ({ limitItems, skipItems }) => {
    const users = await Users.find({}).skip(skipItems).limit(limitItems).lean();
    return users;
  };
  static countAllUsers = async () => {
    const count = await Users.countDocuments({});
    return count;
  };
}
module.exports = AdminsService;
