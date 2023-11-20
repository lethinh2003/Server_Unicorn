"use strict";

const { USER_MESSAGES } = require("../configs/config.user.messages");
const KeysService = require("../services/keys.service");
const UsersService = require("../services/users.service");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { comparePassword, hashPassword } = require("../utils/hashPassword");
const { selectFields, unSelectFields } = require("../utils/selectFields");
const { CreatedResponse, OkResponse } = require("../utils/success_response");
const crypto = require("crypto");
const { createToken } = require("../utils/authUtils");
const sendMail = require("../utils/email");
const AdminsService = require("../services/admins.service");
const LIMIT_ITEMS = 10;
class AdminsController {
  getUsers = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;

    const limitItems = itemsOfPage * 1 || LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const countAllUsers = await AdminsService.countAllUsers();

    const results = await AdminsService.findUsers({ limitItems, skipItems });

    const filterResults = results.map((item) => {
      const newItem = unSelectFields({ fields: ["password", "reset_password_otp", "time_reset_password_otp"], object: item });
      return newItem;
    });
    return new OkResponse({
      data: filterResults,
      metadata: {
        page: currentPage,
        limit: limitItems,
        results: results.length,
        allResults: countAllUsers,
        pageCount: Math.ceil(countAllUsers / limitItems),
      },
    }).send(res);
  });
}

module.exports = new AdminsController();
