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
const { ORDER_STATUS } = require("../configs/config.orders");
const ProductsService = require("../services/products.service");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const ProductSalesService = require("../services/product.sales.service");
const NotificationsService = require("../services/notifications.service");
const { NOTIFICATION_TYPES } = require("../configs/config.notifications");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");

const LIMIT_ITEMS = 10;
class AdminsController {
  getOverview = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    const sevenDaysBefore = new Date(currentDate);
    sevenDaysBefore.setDate(currentDate.getDate() - 7);
    currentDate.setDate(currentDate.getDate() + 1);

    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    const formattedSevenDaysBefore = sevenDaysBefore.toISOString().split("T")[0];

    const countOrders = await OrdersService.countOrders();
    const countUsers = await UsersService.countUsers();
    const listOrders = await OrdersService.revenuePeriodTime({
      startDate: formattedSevenDaysBefore,
      endDate: formattedCurrentDate,
    });
    const initialWeeklyRevenue = 0;
    const sumWeeklyRevenue = listOrders.reduce((initValue, order) => order.total + initValue, initialWeeklyRevenue);

    const result = [{ countOrders }, { countUsers }, { sumWeeklyRevenue }];

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getWeeklyRevenue = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    const listDate = [];
    for (let i = 7; i >= 0; i--) {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - i);
      const formattedNewDate = newDate.toISOString().split("T")[0];

      const newNextDate = new Date(newDate);
      newNextDate.setDate(newDate.getDate() + 1);
      const formattedNewNextDate = newNextDate.toISOString().split("T")[0];

      listDate.push({
        currentDate: formattedNewDate,
        nextDate: formattedNewNextDate,
      });
    }

    const getListOrderByDate = listDate.map((date) => {
      return OrdersService.revenuePeriodTime({
        startDate: date.currentDate,
        endDate: date.nextDate,
      }).then((listOrders) => {
        const initialWeeklyRevenue = 0;
        const sumWeeklyRevenue = listOrders.reduce((initValue, order) => order.total + initValue, initialWeeklyRevenue);
        return {
          ...date,
          revenue: sumWeeklyRevenue,
          nextDate: undefined,
        };
      });
    });

    const result = await Promise.all(getListOrderByDate);

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getMonthlyRevenue = catchAsync(async (req, res, next) => {
    const currentYear = new Date().getFullYear();
    const beginningOfYear = new Date(`${currentYear}-01-01T00:00:00`);
    const nextYear = currentYear + 1;
    const beginningOfNextYear = new Date(`${nextYear}-01-01T00:00:00`);

    const getData = await OrdersService.getMonthlyRevenueData({ startDate: beginningOfYear, endDate: beginningOfNextYear });

    const listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const result = [];

    listMonth.filter((month) => {
      const findMonthData = getData.find((data) => data._id.month === month);
      if (findMonthData) {
        result.push({
          currentMonth: "Tháng " + month,
          revenue: findMonthData.revenue,
        });
      } else {
        result.push({
          currentMonth: "Tháng " + month,
          revenue: 0,
        });
      }
    });

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getDetailedOrder = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const { orderId } = req.params;
    const result = await OrdersService.findById({ _id: orderId, userId: _id });
    if (!result) {
      return next(new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS));
    }
    // get order items
    const listOrderItems = await OrderItemsService.findByOrderId({ orderId });

    return new OkResponse({
      data: { ...result, listOrderItems: listOrderItems },
    }).send(res);
  });

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
  getAllUsers = catchAsync(async (req, res, next) => {
    const results = await AdminsService.findAllUsers();

    const filterResults = results.map((item) => {
      const newItem = unSelectFields({ fields: ["password", "reset_password_otp", "time_reset_password_otp"], object: item });
      return newItem;
    });
    return new OkResponse({
      data: filterResults,
      metadata: {
        results: results.length,
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

  updateOrder = catchAsync(async (req, res, next) => {
    const { orderId, orderStatus } = req.body;
    if (!orderId || !orderStatus) {
      return next(new UnauthorizedError(USER_MESSAGES.INPUT_MISSING));
    }
    const session = await mongoose.startSession();
    const options = { session };
    try {
      await session.withTransaction(async () => {
        const findOrder = await OrdersService.findById({ _id: orderId, options });
        if (findOrder) {
          const previousStatus = findOrder.order_status;
          // Update status order
          await OrdersService.updateOneById({
            _id: orderId,
            update: {
              order_status: orderStatus,
            },
            options,
          });

          // Notifications
          if (orderStatus === ORDER_STATUS.DELIVERING) {
            NotificationsService.createNotification({
              receiveId: findOrder.user,
              type: NOTIFICATION_TYPES.ORDER,
              title: "Đơn hàng đã được xác nhận và đang vận chuyển",
              content: "Đơn hàng của bạn đang được vận chuyển, hãy chờ điện thoại để nhận hàng",
              image: "https://i.imgur.com/KfHzRg5.png",
              options: {
                orderId: findOrder._id,
              },
            }).catch((err) => console.log(err));
          } else if (orderStatus === ORDER_STATUS.DELIVERED) {
            NotificationsService.createNotification({
              receiveId: findOrder.user,
              type: NOTIFICATION_TYPES.ORDER,
              title: "Đơn hàng đã được giao thành công",
              content: "Đơn hàng của bạn đã được giao, hãy đánh giá trải nghiệm mua hàng của bạn nhé",
              image: "https://i.imgur.com/x65j6RE.png",
              options: {
                orderId: findOrder._id,
              },
            }).catch((err) => console.log(err));
          } else if (orderStatus === ORDER_STATUS.CANCELLED) {
            NotificationsService.createNotification({
              receiveId: findOrder.user,
              type: NOTIFICATION_TYPES.ORDER,
              title: "Đơn hàng đã bị hủy",
              content: "Đơn hàng của bạn đã bị hủy, vui lòng liên hệ quản trị để biết thêm chi tiết",
              image: "https://i.imgur.com/ZVCwRzt.png",
              options: {
                orderId: findOrder._id,
              },
            }).catch((err) => console.log(err));
          }
          // If current status is not cancelled, and status update is cancelled -> restore quantity product
          if (previousStatus !== ORDER_STATUS.CANCELLED && orderStatus === ORDER_STATUS.CANCELLED) {
            // Restore quantity products
            const listOrderItems = await OrderItemsService.findByOrderId({
              orderId: orderId,
              options,
            });
            const listProducts = listOrderItems.map((orderItem) => orderItem.data);

            const listUpdateQuantityProducts = listProducts.map((item) => {
              return ProductsService.increseQuantityProduct({
                productId: item.product,
                productSize: item.size,
                productQuantities: item.quantities,
                options,
              });
            });
            await Promise.all(listUpdateQuantityProducts);
          }
        } else {
          throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
        }
      }, options);
    } catch (err) {
      throw err;
    } finally {
      session.endSession();
    }
    return new OkResponse({
      message: ORDER_MESSAGES.UPDATE_ORDER_STATUS_SUCCESS,
    }).send(res);
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

  createProduct = catchAsync(async (req, res, next) => {
    const {
      parentProductId,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
      productSaleEvent,
      productStatus,
    } = req.body;

    if (
      !productName ||
      !productColor ||
      !productSizes ||
      !productCategories ||
      !productImages ||
      !productGender ||
      !productOriginalPrice ||
      !productDescription
    ) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await AdminsService.createProduct({
      parentProductId: parentProductId ? parentProductId : undefined,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
      productSaleEvent: productSaleEvent ? productSaleEvent : undefined,
      productStatus,
    });

    return new CreatedResponse({
      message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    }).send(res);
  });
  updateProduct = catchAsync(async (req, res, next) => {
    const {
      productId,
      parentProductId,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
      productSaleEvent,
      productStatus,
    } = req.body;

    if (
      !productId ||
      !productName ||
      !productColor ||
      !productSizes ||
      !productCategories ||
      !productImages ||
      !productGender ||
      !productOriginalPrice ||
      !productDescription
    ) {
      return next(new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING));
    }
    const result = await AdminsService.updateProduct({
      productId,
      parentProductId: parentProductId ? parentProductId : undefined,
      productName,
      productColor,
      productSizes,
      productCategories,
      productImages,
      productGender,
      productOriginalPrice,
      productDescription,
      productStatus,
      productSaleEvent: productSaleEvent ? productSaleEvent : undefined,
    });

    return new OkResponse({
      message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    }).send(res);
  });
  deleteProduct = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const options = { session };
      const { productId } = req.body;

      if (!productId) {
        throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
      }

      // delete favorite product

      await AdminsService.deleteFavoriteProductByProductId({
        productId,
        options,
      });

      // delete cart item

      await AdminsService.deleteCartItemByProductId({
        productId,
        options,
      });

      // delete product review
      await AdminsService.deleteProductReviewByProductId({
        productId,
        options,
      });

      // delete product

      await AdminsService.deleteProduct({
        productId,
        options,
      });
      await session.commitTransaction();
      return new OkResponse({
        message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
      }).send(res);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  });
  getAllParentProductsByGender = catchAsync(async (req, res, next) => {
    const { gender } = req.query;

    const result = await ProductsService.getAllParentProductsAdminByGender({ gender });

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getProductSaleEvents = catchAsync(async (req, res, next) => {
    const result = await ProductSalesService.findAllSaleEvents();

    return new OkResponse({
      data: result,
    }).send(res);
  });

  getAllProducts = catchAsync(async (req, res, next) => {
    const { page, itemsOfPage } = req.query;
    const limitItems = itemsOfPage * 1 || PRODUCT_PAGINATION.LIMIT_ITEMS;
    const currentPage = page * 1 || 1;
    const skipItems = (currentPage - 1) * limitItems;
    const listProducts = await AdminsService.findAllProducts({
      skipItems,
      limitItems,
    });

    const countAllProducts = await AdminsService.countAllProducts();

    return new OkResponse({
      data: listProducts,
      metadata: {
        page: currentPage,
        limit: limitItems,
        results: listProducts.length,
        allResults: countAllProducts,
        pageCount: Math.ceil(countAllProducts / limitItems),
      },
    }).send(res);
  });

  getDetailedProduct = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const { productId } = req.params;
    const result = await AdminsService.findDetailProduct({
      productId,
    });
    if (!result) {
      return next(new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS));
    }

    return new OkResponse({
      data: result,
    }).send(res);
  });

  createVoucher = catchAsync(async (req, res, next) => {
    const { userId, code, discount, description, minOrderQuantity, minOrderAmount, expiredDate, type, status = true } = req.body;
    if (!code || !discount || !description || !expiredDate || !type) {
      return next(new UnauthorizedError(VOUCHER_MESSAGES.INPUT_MISSING));
    }
    // Check user is exists
    const findUser = await UsersService.findById({ _id: userId });
    if (!findUser) {
      return next(new BadRequestError(USER_MESSAGES.USER_NOT_EXIST_DB));
    }
    // Check user has a voucher?
    const checkVoucherIsExists = await VouchersService.findOneByUserAndCode({
      userId,
      code,
    });
    if (checkVoucherIsExists) {
      return next(new BadRequestError(VOUCHER_MESSAGES.CODE_IS_EXISTS));
    }
    // Create new voucher
    await VouchersService.createVoucher({
      userId,
      code,
      discount,
      description,
      minOrderQuantity,
      minOrderAmount,
      expiredDate,
      type,
      status,
    });
    // notifications
    NotificationsService.createNotification({
      receiveId: userId,
      type: NOTIFICATION_TYPES.DISCOUNT,
      title: "Bạn nhận được voucher mới",
      content: `Bạn nhận được voucher giảm ${discount}%`,
      image: "https://i.imgur.com/ELDMrfv.png",
      options: {
        voucherCode: code,
      },
    }).catch((err) => console.log(err));

    return new CreatedResponse({
      message: VOUCHER_MESSAGES.ADD_VOUCHER_SUCCESS,
    }).send(res);
  });
}

module.exports = new AdminsController();
