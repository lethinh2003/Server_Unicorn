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
const UserAddressesService = require("../services/user.addessses.service");
const CartsService = require("../services/carts.service");
const CartItemsService = require("../services/cart.items.service");
const OrdersService = require("../services/orders.service");
const OrderItemsService = require("../services/order.items.service");
const ProductReviewsService = require("../services/product.reviews.service");
const VouchersService = require("../services/vouchers.service");
const FavoriteProductsService = require("../services/favorite.products.service");
const mongoose = require("mongoose");
const { ADMIN_MESSAGES } = require("../configs/config.admin.messages");
const { CART_MESSAGES } = require("../configs/config.cart.messages");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");

const LIMIT_ITEMS = 10;
class AdminsController {
  getDetailUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const result = await AdminsService.findDetailUserById({ userId });

    return new OkResponse({
      data: result,
      metadata: {
        userId,
      },
    }).send(res);
  });
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

  createUser = catchAsync(async (req, res, next) => {
    const { email, password, birthday, gender, name, phone_number, status, role } = req.body;
    if (!email || !password || !name || !gender) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    // Check email is exist
    const findUser = await UsersService.findByEmail({ email });
    if (findUser) {
      return next(new BadRequestError(USER_MESSAGES.EMAIL_EXIST_DB));
    }
    const result = await AdminsService.createUser({ email, password, birthday, gender, name, phone_number, status, role });

    return new CreatedResponse({
      message: ADMIN_MESSAGES.CREATE_USER_SUCCESS,
      data: unSelectFields({ fields: ["password"], object: result }),
    }).send(res);
  });
  updateUser = catchAsync(async (req, res, next) => {
    const { userId, email, password, birthday, gender, name, phone_number, status, role } = req.body;
    if (!userId || !email || !name || !gender) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    let passwordUpdate = "";
    // Check email is exist
    const findUser = await UsersService.findByEmail({ email });
    if (!findUser) {
      return next(new BadRequestError(USER_MESSAGES.USER_NOT_EXIST_DB));
    }
    if (!password) {
      passwordUpdate = findUser.password;
    } else {
      passwordUpdate = await hashPassword(password);
    }
    const result = await AdminsService.updateUser({
      userId,
      email,
      password: passwordUpdate,
      birthday: birthday ?? findUser.birthday,
      gender,
      name: name ?? findUser.name,
      phone_number: phone_number ?? findUser.phone_number,
      status: !!status,
      role: role ?? findUser.role,
    });

    return new OkResponse({
      message: ADMIN_MESSAGES.UPDATE_USER_SUCCESS,
    }).send(res);
  });

  deleteUser = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      const { userId } = req.body;
      const options = { session };

      if (!userId) {
        throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
      }
      const checkUserExist = await UsersService.findById({ _id: userId });
      if (!checkUserExist) {
        throw new UnauthorizedError(USER_MESSAGES.USER_NOT_EXIST_DB);
      }
      await session.withTransaction(async () => {
        // Delete User
        const deleteUser = await UsersService.deleteById({ userId, options });
        // Delete User Address
        const deleteUserAddresses = await UserAddressesService.deleteAddressesByUser({ userId, options });

        // Delete Cart

        const deleteCart = await CartsService.deleteByUserId({ userId, options });

        // Delete Cart Item
        const deleteCartitems = await CartItemsService.deleteByUserId({ userId, options });

        // Delete Favorite Product
        const deleteFavorieProducts = await FavoriteProductsService.deleteByUserId({ userId, options });

        // Delete Key
        const deleteKey = await KeysService.deleteByUserId({ userId, options });

        // Delete Order
        const deleteOrder = await OrdersService.deleteByUserId({ userId, options });

        // Delete Order Items
        const deleteOrderItems = await OrderItemsService.deleteByUserId({ userId, options });

        // Delete Product Review
        const deleteProductReviews = await ProductReviewsService.deleteByUserId({ userId, options });

        // Delete Voucher
        const deleteVouchers = await VouchersService.deleteByUserId({ userId, options });
      }, options);

      return new OkResponse({
        message: ADMIN_MESSAGES.DELETE_USER_SUCCESS,
        metadata: {
          userId,
        },
      }).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    } finally {
      session.endSession();
    }
  });
  deleteOrder = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      const { orderId } = req.body;
      const options = { session };

      if (!orderId) {
        throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
      }
      const checkOrderExist = await OrdersService.findById({ _id: orderId });
      if (!checkOrderExist) {
        throw new UnauthorizedError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
      }
      await session.withTransaction(async () => {
        // Delete Order Items
        const deleteOrderItems = await OrderItemsService.deleteByOrderId({ orderId, options });

        // Delete Order
        const deleteOrder = await OrdersService.deleteById({ orderId, options });
      }, options);

      return new OkResponse({
        message: ADMIN_MESSAGES.DELETE_ORDER_SUCCESS,
        metadata: {
          orderId,
        },
      }).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    } finally {
      session.endSession();
    }
  });

  getOrders = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;

    const limitItems = itemsOfPage * 1 || LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const countAllOrders = await AdminsService.countAllOrders();

    const results = await AdminsService.findOrders({ limitItems, skipItems });

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
        allResults: countAllOrders,
        pageCount: Math.ceil(countAllOrders / limitItems),
      },
    }).send(res);
  });
}

module.exports = new AdminsController();
