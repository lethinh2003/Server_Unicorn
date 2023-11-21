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
        message: USER_MESSAGES.DELETE_USER_SUCCESS,
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
}

module.exports = new AdminsController();
