"use strict";
const catchAsync = require("../utils/catch_async");
const { CreatedResponse, OkResponse } = require("../utils/success_response");
const AdminsService = require("../services/admins.service");

const { ADMIN_MESSAGES } = require("../configs/config.admin.messages");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");

class AdminsController {
  getOverview = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    const sevenDaysBefore = new Date(currentDate);
    sevenDaysBefore.setDate(currentDate.getDate() - 7);
    currentDate.setDate(currentDate.getDate() + 1);

    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    const formattedSevenDaysBefore = sevenDaysBefore.toISOString().split("T")[0];

    const result = await AdminsService.getOverview({
      startDate: formattedSevenDaysBefore,
      endDate: formattedCurrentDate,
    });

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
    const result = await AdminsService.getWeeklyRevenue({
      listDate,
    });

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getMonthlyRevenue = catchAsync(async (req, res, next) => {
    const currentYear = new Date().getFullYear();
    const beginningOfYear = new Date(`${currentYear}-01-01T00:00:00`);
    const nextYear = currentYear + 1;
    const beginningOfNextYear = new Date(`${nextYear}-01-01T00:00:00`);

    const result = await AdminsService.getMonthlyRevenue({
      startDate: beginningOfYear,
      endDate: beginningOfNextYear,
    });

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getDetailedOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const results = await AdminsService.getDetailedOrder({
      orderId,
    });
    return new OkResponse({
      data: results,
    }).send(res);
  });

  getDetailUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const result = await AdminsService.getDetailUser({ userId });

    return new OkResponse({
      data: result,
      metadata: {
        ...req.params,
      },
    }).send(res);
  });
  getUsers = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;

    const { results, currentPage, limitItems, countAllUsers } = await AdminsService.getUsers({
      itemsOfPage,
      page,
    });
    return new OkResponse({
      data: results,
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
    const results = await AdminsService.getAllUsers();

    return new OkResponse({
      data: results,
      metadata: {
        results: results.length,
      },
    }).send(res);
  });

  createUser = catchAsync(async (req, res, next) => {
    const { email, password, birthday, gender, name, phone_number, status, role } = req.body;

    return new CreatedResponse({
      message: ADMIN_MESSAGES.CREATE_USER_SUCCESS,
      data: await AdminsService.createUser({ email, password, birthday, gender, name, phone_number, status, role }),
    }).send(res);
  });
  updateUser = catchAsync(async (req, res, next) => {
    const { userId, email, password, birthday, gender, name, phone_number, status, role } = req.body;
    await AdminsService.updateUser({
      userId,
      email,
      password,
      birthday,
      gender,
      name,
      phone_number,
      status,
      role,
    });

    return new OkResponse({
      message: ADMIN_MESSAGES.UPDATE_USER_SUCCESS,
    }).send(res);
  });

  deleteUser = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    await AdminsService.deleteUser({
      userId,
    });
    return new OkResponse({
      message: ADMIN_MESSAGES.DELETE_USER_SUCCESS,
      metadata: {
        ...req.body,
      },
    }).send(res);
  });
  deleteOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.body;
    await AdminsService.deleteOrder({ orderId });
    return new OkResponse({
      message: ADMIN_MESSAGES.DELETE_ORDER_SUCCESS,
      metadata: {
        orderId,
      },
    }).send(res);
  });

  updateOrder = catchAsync(async (req, res, next) => {
    const { orderId, orderStatus } = req.body;
    await AdminsService.updateOrder({
      orderId,
      orderStatus,
    });
    return new OkResponse({
      metadata: { ...req.body },
      message: ORDER_MESSAGES.UPDATE_ORDER_STATUS_SUCCESS,
    }).send(res);
  });

  getOrders = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;

    const { results, limitItems, currentPage, countAllOrders } = await AdminsService.getOrders({
      itemsOfPage,
      page,
    });
    return new OkResponse({
      data: results,
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

    const result = await AdminsService.createProduct({
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

    const result = await AdminsService.updateProduct({
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
    });

    return new OkResponse({
      message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    }).send(res);
  });
  deleteProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.body;
    await AdminsService.deleteProduct({
      productId,
    });
    return new OkResponse({
      message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    }).send(res);
  });
  getAllParentProductsByGender = catchAsync(async (req, res, next) => {
    const { gender } = req.query;

    const result = await AdminsService.getAllParentProductsByGender({ gender });

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getProductSaleEvents = catchAsync(async (req, res, next) => {
    const result = await AdminsService.getProductSaleEvents({});

    return new OkResponse({
      data: result,
    }).send(res);
  });

  getAllProducts = catchAsync(async (req, res, next) => {
    const { page, itemsOfPage } = req.query;
    const { listProducts, countAllProducts, limitItems, currentPage } = await AdminsService.getAllProducts({
      page,
      itemsOfPage,
    });

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
    const { productId } = req.params;
    const result = await AdminsService.getDetailedProduct({
      productId,
    });

    return new OkResponse({
      data: result,
    }).send(res);
  });
  getDetailedCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const result = await AdminsService.getDetailedCategory({
      categoryId,
    });

    return new OkResponse({
      data: result,
    }).send(res);
  });

  createVoucher = catchAsync(async (req, res, next) => {
    const { userId, code, discount, description, minOrderQuantity, minOrderAmount, expiredDate, type, status = true } = req.body;
    const voucher = await AdminsService.createVoucher({
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
    return new CreatedResponse({
      message: VOUCHER_MESSAGES.ADD_VOUCHER_SUCCESS,
    }).send(res);
  });

  getCategories = catchAsync(async (req, res, next) => {
    const { itemsOfPage, page } = req.query;

    const { results, countAllCategories, limitItems, currentPage } = await AdminsService.getCategories({ itemsOfPage, page });
    return new OkResponse({
      data: results,
      metadata: {
        page: currentPage,
        limit: limitItems,
        results: results.length,
        allResults: countAllCategories,
        pageCount: Math.ceil(countAllCategories / limitItems),
      },
    }).send(res);
  });

  updateCategory = catchAsync(async (req, res, next) => {
    const { categoryId, parentCategory, categoryImage, categoryGender, categoryKeyword, categoryName, categoryStatus } = req.body;

    const result = await AdminsService.updateCategory({
      categoryId,
      parentCategory,
      categoryImage,
      categoryGender,
      categoryKeyword,
      categoryName,
      categoryStatus,
    });

    return new OkResponse({
      message: PRODUCT_MESSAGES.UPDATE_PRODUCT_CATEGORY_SUCCESS,
    }).send(res);
  });
}

module.exports = new AdminsController();
