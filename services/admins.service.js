"use strict";
const OrderRepository = require("../models/repositories/order.repository");
const UserRepository = require("../models/repositories/user.repository");
const mongoose = require("mongoose");

const { CART_PAYMENT_METHOD, SHIPPING_COST, ORDER_STATUS, ONLINE_PAYMENT_TYPE } = require("../configs/config.orders");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const UserAddressesRepository = require("../models/repositories/user.address.repository");
const CartRepository = require("../models/repositories/cart.repository");
const CartItemRepository = require("../models/repositories/cart.item.repository");
const FavoriteProductRepository = require("../models/repositories/favorite.product.repository");
const KeyRepository = require("../models/repositories/key.repository");
const OrderItemRepository = require("../models/repositories/order.item.repository");
const ProductReviewRepository = require("../models/repositories/product.review.repository");
const VoucherRepository = require("../models/repositories/voucher.repository");
const { hashPassword } = require("../utils/hashPassword");
const { ORDER_MESSAGES } = require("../configs/config.order.messages");
const EmailService = require("./email.service");
const NotificationRepository = require("../models/repositories/notification.repository");
const { NOTIFICATION_TYPES } = require("../configs/config.notifications");
const { increseQuantityProduct } = require("../utils/product");
const ProductRepository = require("../models/repositories/product.repository");
const ProductSaleRepository = require("../models/repositories/product.sale.repository");
const { PRODUCT_MESSAGES } = require("../configs/config.product.messages");
const { VOUCHER_MESSAGES } = require("../configs/config.voucher.messages");
const ProductCategoriesRepository = require("../models/repositories/product.category.repository");

const ORDER_QUERY_TYPE = { ...ORDER_STATUS, ALL: "all" };

class AdminsService {
  static getOverview = async ({ startDate, endDate }) => {
    const [countOrders, countUsers, listOrders] = await Promise.all([
      OrderRepository.countDocuments({}),
      UserRepository.countDocuments({}),
      OrderRepository.findAll({
        query: {
          order_status: ORDER_QUERY_TYPE.DELIVERED,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      }),
    ]);
    const initialWeeklyRevenue = 0;
    const sumWeeklyRevenue = listOrders.reduce((initValue, order) => order.total + initValue, initialWeeklyRevenue);

    const result = [{ countOrders }, { countUsers }, { sumWeeklyRevenue }];
    return result;
  };
  static getWeeklyRevenue = async ({ listDate = [] }) => {
    const getListOrderByDate = listDate.map((date) => {
      const startDate = date.currentDate;
      const endDate = date.nextDate;

      return OrderRepository.findAll({
        query: {
          order_status: ORDER_QUERY_TYPE.DELIVERED,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
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
    return result;
  };

  static getMonthlyRevenue = async ({ startDate, endDate }) => {
    const getData = await OrderRepository.aggregate({
      filter: {
        order_status: ORDER_QUERY_TYPE.DELIVERED,
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
      group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$total" },
      },
      sort: { "_id.month": 1 }, // Sort by month
    });

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
    return result;
  };
  static getAllUsers = async () => {
    const results = await UserRepository.findAll({
      select: ["-password", "-reset_password_otp", "-time_reset_password_otp"].join(" "),
    });

    return results;
  };
  static getDetailUser = async ({ userId }) => {
    const result = await UserRepository.findOne({ query: { _id: userId } });

    return result;
  };
  static deleteUser = async ({ userId }) => {
    if (!userId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const session = await mongoose.startSession();
    const options = { session };
    try {
      const checkUserExist = await UserRepository.findOne({ query: { _id: userId } });
      if (!checkUserExist) {
        throw new UnauthorizedError(USER_MESSAGES.USER_NOT_EXIST_DB);
      }

      await session.withTransaction(async () => {
        try {
          // Delete User
          const deleteUser = await UserRepository.findOneAndDelete({ query: { _id: userId }, options });
          // Delete User Address
          const deleteUserAddresses = await UserAddressesRepository.findManyAndDelete({ query: { user_id: userId }, options });

          // Delete Cart
          const deleteCart = await CartRepository.findOneAndDelete({ query: { user: userId }, options });

          // Delete Cart Item
          const deleteCartitems = await CartItemRepository.deleteMany({
            query: {
              user_id: userId,
            },
            options,
          });

          // Delete Favorite Product
          const deleteFavorieProducts = await FavoriteProductRepository.deleteMany({ query: { user: userId }, options });

          // Delete Key
          const deleteKey = await KeyRepository.findOneAndDelete({ query: { user: userId }, options });

          // Delete Order
          const deleteOrder = await OrderRepository.findManyAndDelete({
            query: {
              user: userId,
            },
            options,
          });

          // Delete Order Items
          const deleteOrderItems = await OrderItemRepository.findManyAndDelete({
            query: {
              user_id: userId,
            },
            options,
          });

          // Delete Product Review
          const deleteProductReviews = await ProductReviewRepository.findManyAndDelete({ query: { user: userId }, options });

          // Delete Voucher
          const deleteVouchers = await VoucherRepository.findManyAndDelete({ query: { user: userId }, options });

          await session.commitTransaction();
        } catch (err) {
          await session.abortTransaction();
          throw err;
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.endSession();
    }
  };
  static updateUser = async ({ userId, email, password, birthday, gender, name, phone_number, status, role }) => {
    if (!userId || !email || !name || !gender) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    let passwordUpdate = "";
    // Check email is exist
    const findUser = await UserRepository.findOne({ query: { email } });
    if (!findUser) {
      throw new BadRequestError(USER_MESSAGES.USER_NOT_EXIST_DB);
    }
    if (!password) {
      passwordUpdate = findUser.password;
    } else {
      passwordUpdate = await hashPassword(password);
    }

    const user = await UserRepository.findOneAndUpdate({
      query: { _id: userId, email: email },
      update: {
        password: passwordUpdate,
        birthday: birthday ?? findUser.birthday,
        gender,
        name: name ?? findUser.name,
        phone_number: phone_number ?? findUser.phone_number,
        status: !!status,
        role: role ?? findUser.role,
      },
      options: {
        runValidators: true,
      },
    });

    return user;
  };

  static getUsers = async ({ itemsOfPage = 10, page = 1 }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    const countAllUsers = await UserRepository.countDocuments({});

    const results = await UserRepository.find({
      limit: limitItems,
      skip: skipItems,
      select: ["-password", "-reset_password_otp", "-time_reset_password_otp"].join(" "),
    });

    return { limitItems, currentPage, results, countAllUsers };
  };

  static createUser = async ({ email, password, birthday, gender, name, phone_number, status, role }) => {
    if (!email || !password || !name || !gender) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    // Check email is exist
    const findUser = await UserRepository.findOne({ query: { email } });
    if (findUser) {
      throw new BadRequestError(USER_MESSAGES.EMAIL_EXIST_DB);
    }
    const { _doc } = await UserRepository.createOne({
      data: {
        email,
        password,
        birthday,
        gender,
        name,
        phone_number,
        status,
        role,
      },
    });
    return _doc;
  };

  /// ORDER
  static getOrders = async ({ itemsOfPage = 10, page = 1 }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    const countAllOrders = await OrderRepository.countDocuments({});

    const results = await OrderRepository.find({
      skip: skipItems,
      limit: limitItems,
      populate: {
        path: "user",
        select: ["-password", "-reset_password_otp", "-time_reset_password_otp"].join(" "),
      },
      sort: "-createdAt",
    });

    return { results, limitItems, currentPage, countAllOrders };
  };

  static updateOrder = async ({ orderId, orderStatus }) => {
    if (!orderId || !orderStatus) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const session = await mongoose.startSession();
    const options = { session };
    try {
      await session.withTransaction(async () => {
        const findOrder = await OrderRepository.findOne({ query: { _id: orderId } });
        if (!findOrder) {
          throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
        }
        const findUser = await UserRepository.findOne({
          query: {
            _id: findOrder.user,
          },
        });
        if (!findUser) {
          throw new BadRequestError(USER_MESSAGES.USER_NOT_EXIST_DB);
        }
        const previousStatus = findOrder.order_status;
        // Update status order
        await OrderRepository.findOneAndUpdate({
          query: {
            _id: orderId,
          },
          update: {
            order_status: orderStatus,
          },
          options,
        });

        // Notifications
        if (orderStatus === ORDER_STATUS.DELIVERING) {
          await Promise.all([
            EmailService.sendEmailOrderDeliveringStatus({
              email: findUser.email,
              orderId: findOrder._id,
            }),
            NotificationRepository.createOne({
              data: {
                receive_id: findOrder.user,
                type: NOTIFICATION_TYPES.ORDER,
                title: "Đơn hàng đã được xác nhận và đang vận chuyển",
                content: `Đơn hàng ${findOrder._id} của bạn đang được vận chuyển, hãy chờ điện thoại để nhận hàng`,
                image: "https://i.imgur.com/KfHzRg5.png",
                options: {
                  orderId: findOrder._id,
                },
              },
              options,
            }),
          ]);
        } else if (orderStatus === ORDER_STATUS.DELIVERED) {
          await Promise.all([
            EmailService.sendEmailOrderDeliveredStatus({
              email: findUser.email,
              orderId: findOrder._id,
            }),
            NotificationRepository.createOne({
              data: {
                receive_id: findOrder.user,
                type: NOTIFICATION_TYPES.ORDER,
                title: "Đơn hàng đã được giao thành công",
                content: `Đơn hàng ${findOrder._id} của bạn đã được giao, hãy đánh giá trải nghiệm mua hàng của bạn nhé`,
                image: "https://i.imgur.com/x65j6RE.png",
                options: {
                  orderId: findOrder._id,
                },
              },
              options,
            }),
          ]);
        } else if (orderStatus === ORDER_STATUS.CANCELLED) {
          await Promise.all([
            EmailService.sendEmailOrderCancelledStatus({
              email: findUser.email,
              orderId: findOrder._id,
            }),
            NotificationRepository.createOne({
              data: {
                receive_id: findOrder.user,
                type: NOTIFICATION_TYPES.ORDER,
                title: "Đơn hàng đã bị hủy",
                content: `Đơn hàng ${findOrder._id} của bạn đã bị hủy, vui lòng liên hệ quản trị để biết thêm chi tiết`,
                image: "https://i.imgur.com/ZVCwRzt.png",
                options: {
                  orderId: findOrder._id,
                },
              },
              options,
            }),
          ]);
        }
        // If current status is not cancelled, and status update is cancelled -> restore quantity product
        if (previousStatus !== ORDER_STATUS.CANCELLED && orderStatus === ORDER_STATUS.CANCELLED) {
          // Restore quantity products
          const listOrderItems = await OrderItemRepository.findAll({
            query: {
              order_id: orderId,
            },
          });
          const listProducts = listOrderItems.map((orderItem) => orderItem.data);

          const listUpdateQuantityProducts = listProducts.map((item) => {
            return increseQuantityProduct({
              productId: item.product,
              productSize: item.size,
              productQuantities: item.quantities,
              options,
            });
          });
          await Promise.all(listUpdateQuantityProducts);
        }
        await session.commitTransaction();
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  };
  static deleteOrder = async ({ orderId }) => {
    if (!orderId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const session = await mongoose.startSession();
    const options = { session };
    try {
      const checkOrderExist = await OrderRepository.findOne({ query: { _id: orderId } });
      if (!checkOrderExist) {
        throw new UnauthorizedError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
      }
      await session.withTransaction(async () => {
        try {
          // Delete Order Items
          const deleteOrderItems = await OrderItemRepository.findManyAndDelete({ query: { order_id: orderId }, options });

          // Delete Order
          const deleteOrder = await OrderRepository.findOneAndDelete({ query: { _id: orderId }, options });
          await session.commitTransaction();
        } catch (err) {
          await session.abortTransaction();
          throw err;
        }
      });
    } catch (err) {
      throw err;
    } finally {
      session.endSession();
    }
  };
  static getDetailedOrder = async ({ orderId }) => {
    if (!orderId) {
      throw new UnauthorizedError(USER_MESSAGES.INPUT_MISSING);
    }
    const result = await OrderRepository.findOne({ query: { _id: orderId } });
    if (!result) {
      throw new BadRequestError(ORDER_MESSAGES.ORDER_IS_NOT_EXISTS);
    }
    // get order items
    const listOrderItems = await OrderItemRepository.findAll({ query: { order_id: orderId } });

    return { ...result, listOrderItems: listOrderItems };
  };
  //// ORDER ////

  /// PRODUCT
  static getAllProducts = async ({ itemsOfPage = 10, page = 1 }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;

    const listProducts = await ProductRepository.find({
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
      limit: limitItems,
      skip: skipItems,
      sort: "-createdAt",
    });

    const countAllProducts = await ProductRepository.countDocuments({});
    return {
      listProducts,
      countAllProducts,
      limitItems,
      currentPage,
    };
  };
  static getAllParentProductsByGender = async ({ gender }) => {
    let query = {
      status: true,
      product_gender: gender,
      $or: [{ parent_product_id: null }, { parent_product_id: undefined }],
    };
    const listProducts = await ProductRepository.findAll({
      query,
      sort: "-createdAt",
    });

    return listProducts;
  };
  static getProductSaleEvents = async ({}) => {
    const results = await ProductSaleRepository.findAll({
      query: {
        status: true,
      },
    });

    return results;
  };
  static getDetailedProduct = async ({ productId }) => {
    const result = await ProductRepository.findOne({
      query: {
        _id: productId,
      },
      populate: "product_color product_sizes.size_type product_categories product_sale_event",
    });

    if (!result) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_IS_NOT_EXISTS);
    }
    return result;
  };
  static createProduct = async ({
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
  }) => {
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
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }

    const { _doc } = await ProductRepository.createOne({
      data: {
        parent_product_id: parentProductId ? parentProductId : undefined,
        product_name: productName,
        product_color: productColor,
        product_sizes: productSizes,
        product_categories: productCategories,
        product_images: productImages,
        product_gender: productGender,
        product_original_price: productOriginalPrice,
        product_description: productDescription,
        product_sale_event: productSaleEvent ? productSaleEvent : undefined,
        status: productStatus,
      },
    });

    return _doc;
  };

  static updateProduct = async ({
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
  }) => {
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
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }

    const result = await ProductRepository.findOneAndUpdate({
      query: {
        _id: productId,
      },
      update: {
        parent_product_id: parentProductId ? parentProductId : undefined,
        product_name: productName,
        product_color: productColor,
        product_sizes: productSizes,
        product_categories: productCategories,
        product_images: productImages,
        product_gender: productGender,
        product_original_price: productOriginalPrice,
        product_description: productDescription,
        product_sale_event: productSaleEvent ? productSaleEvent : undefined,
        status: productStatus,
      },
    });

    return result;
  };
  static deleteProduct = async ({ productId }) => {
    if (!productId) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const options = { session };

      // delete favorite product

      await FavoriteProductRepository.deleteMany({
        query: {
          product_id: productId,
        },
        options,
      });

      // delete cart item

      await CartItemRepository.deleteMany({
        query: {
          "data.product": productId,
        },
        options,
      });

      // delete product review

      await ProductReviewRepository.findManyAndDelete({
        query: {
          $or: [{ product_id: productId }, { parent_product_id: productId }],
        },
        options,
      });

      // delete product
      await ProductRepository.findOneAndDelete({
        query: {
          _id: productId,
        },
        options,
      });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  };
  /// PRODUCT

  /// VOUCHER
  static createVoucher = async ({
    userId,
    code,
    discount,
    description,
    minOrderQuantity,
    minOrderAmount,
    expiredDate,
    type,
    status = true,
  }) => {
    if (!code || !discount || !description || !expiredDate || !type) {
      throw new UnauthorizedError(VOUCHER_MESSAGES.INPUT_MISSING);
    }
    // Check user is exists
    const findUser = await UserRepository.findOne({ query: { _id: userId } });
    if (!findUser) {
      throw new BadRequestError(USER_MESSAGES.USER_NOT_EXIST_DB);
    }
    // Check user has a voucher?
    const checkVoucherIsExists = await VoucherRepository.findOne({
      query: {
        user: userId,
        code,
      },
    });
    if (checkVoucherIsExists) {
      throw new BadRequestError(VOUCHER_MESSAGES.CODE_IS_EXISTS);
    }
    // Create new voucher
    const { _doc } = await VoucherRepository.createOne({
      data: {
        user: userId,
        code,
        discount,
        description,
        min_order_quantity: minOrderQuantity,
        min_order_amount: minOrderAmount,
        expired_date: expiredDate,
        type,
        status,
      },
    });
    // notifications
    NotificationRepository.createOne({
      data: {
        receive_id: userId,
        type: NOTIFICATION_TYPES.DISCOUNT,
        title: "Bạn nhận được voucher mới",
        content: `Bạn nhận được voucher giảm ${discount}%`,
        image: "https://i.imgur.com/ELDMrfv.png",
        options: {
          voucherCode: code,
        },
      },
    }).catch((err) => console.log(err));

    return _doc;
  };

  /// VOUCHER

  /// CATEGORIES
  static getDetailedCategory = async ({ categoryId }) => {
    const result = await ProductCategoriesRepository.findOne({
      query: {
        _id: categoryId,
      },
    });
    if (!result) {
      throw new BadRequestError(PRODUCT_MESSAGES.PRODUCT_CATEGORY_IS_NOT_EXISTS);
    }
    return result;
  };
  static getCategories = async ({ itemsOfPage = 10, page = 1 }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    const countAllCategories = await ProductCategoriesRepository.countDocuments({});

    const results = await ProductCategoriesRepository.find({ limitItems, skipItems });

    return { countAllCategories, results, limitItems, currentPage };
  };
  static updateCategory = async ({
    categoryId,
    parentCategory,
    categoryImage,
    categoryGender,
    categoryKeyword,
    categoryName,
    categoryStatus,
  }) => {
    if (!categoryId || !categoryImage || !categoryGender || !categoryName) {
      throw new UnauthorizedError(PRODUCT_MESSAGES.INPUT_MISSING);
    }
    const result = await ProductCategoriesRepository.findOneAndUpdate({
      query: {
        _id: categoryId,
      },
      update: {
        product_category_parent_id: parentCategory ? parentCategory : undefined,
        product_category_image: categoryImage,
        product_category_gender: categoryGender,
        product_category_keyword: categoryKeyword,
        product_category_name: categoryName,
        status: categoryStatus,
      },
    });
  };

  /// CATEGORIES
  ////
}
module.exports = AdminsService;
