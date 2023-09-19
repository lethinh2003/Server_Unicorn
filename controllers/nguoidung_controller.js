"use strict";

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const AppError = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const NguoiDungService = require("../services/nguoidung.service");
const { OkResponse, CreatedResponse } = require("../utils/success_response");
const { createToken, verifyJWT } = require("../utils/authUtils");
const KeyService = require("../services/key.service");
const { selectFields } = require("../utils/selectFields");

class NguoiDungController {
  getUser = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const user = await NguoiDungService.getDetailNguoiDung({ taiKhoan });
    return new OkResponse({ data: user }).send(res);
  });
  handleRefreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError("Có gì đó không ổn", 404));
    }
    const checkRefreshTokenUsed = await KeyService.findByRefreshTokensUsed({ refreshToken });
    if (checkRefreshTokenUsed) {
      // delete key store by user id
      const delKey = await KeyService.deleteByID({ ID: checkRefreshTokenUsed._id });
      return next(new AppError("Có gì đó không ổn, vui lòng đăng nhập lại", 400));
    }
    // generate new key
    const getKeyStore = await KeyService.findByRefreshToken({
      refreshToken,
    });
    if (!getKeyStore) {
      // log out
      return next(new AppError("Có gì đó không ổn, vui lòng đăng nhập lại", 404));
    }
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expireAccessToken,
    } = createToken({
      payload: { taiKhoan: getKeyStore.user.taiKhoan, role: getKeyStore.user.role, id: getKeyStore.user._id },
      publicKey: getKeyStore.publicKey,
      privateKey: getKeyStore.privateKey,
    });
    await getKeyStore.update({
      $push: {
        refreshTokens: newRefreshToken,
        refreshTokensUsed: refreshToken,
      },
    });
    await getKeyStore.update({
      $pull: {
        refreshTokens: refreshToken,
      },
    });

    return new OkResponse({
      data: getKeyStore.user,
      metadata: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expireAccessToken,
        },
      },
    }).send(res);
  });

  loginUser = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau } = req.body;
    if (!taiKhoan || !matKhau) {
      return next(new AppError("Vui lòng nhập đầy đủ thông tin", 401));
    }
    const user = await NguoiDungService.loginNguoiDung({ taiKhoan, matKhau });
    const findKeyStore = await KeyService.findByUserID({ userId: user._id });
    if (!findKeyStore) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      const { accessToken, refreshToken, expireAccessToken } = createToken({
        payload: { taiKhoan: user.taiKhoan, role: user.role, id: user._id },
        publicKey,
        privateKey,
      });
      const updateKey = await KeyService.createKeyPair({
        userID: user._id,
        refreshToken,
        publicKey,
        privateKey,
      });
      return new OkResponse({
        message: "Đăng nhập thành công",
        data: user,
        metadata: {
          tokens: {
            accessToken,
            refreshToken,
            expireAccessToken,
          },
        },
      }).send(res);
    } else {
      const { publicKey, privateKey } = findKeyStore;
      const { accessToken, refreshToken, expireAccessToken } = createToken({
        payload: { taiKhoan: user.taiKhoan, role: user.role, id: user._id },
        publicKey,
        privateKey,
      });
      const updateKey = await KeyService.createKeyPair({
        userID: user._id,
        refreshToken,
        publicKey,
        privateKey,
      });
      return new OkResponse({
        message: "Đăng nhập thành công",
        data: user,
        metadata: {
          tokens: {
            accessToken,
            refreshToken,
            expireAccessToken,
          },
        },
      }).send(res);
    }
  });
  logoutUser = catchAsync(async (req, res, next) => {
    const { userId, refreshToken } = req.body;
    if (!userId || !refreshToken) {
      return next(new AppError("Có gì đó không ổn", 401));
    }
    const delKey = await KeyService.deleteByUserIdAndRT({
      userId,
      refreshToken,
    });
    return new OkResponse({
      message: "Đăng xuất thành công",
    }).send(res);
  });

  createUser = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau, nhapLaiMatKhau, doiHinh } = req.body;
    if (!taiKhoan || !matKhau || !nhapLaiMatKhau || !doiHinh) {
      return next(new AppError("Vui lòng nhập đầy đủ thông tin", 401));
    }
    const result = await NguoiDungService.createNguoiDung({ taiKhoan, matKhau, nhapLaiMatKhau, doiHinh });
    return new CreatedResponse({ message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập", data: result }).send(res);
  });

  doiMatKhau = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const { matKhauCu, matKhauMoi, nhapLaiMatKhauMoi } = req.body;
    if (!matKhauCu || !matKhauMoi || !nhapLaiMatKhauMoi) {
      return next(new AppError("Vui lòng nhập đầy đủ thông tin", 401));
    }
    if (matKhauCu === matKhauMoi) {
      return next(new AppError("Mật khẩu mới không được trùng với mật khẩu hiện tại", 401));
    }
    if (matKhauMoi !== nhapLaiMatKhauMoi) {
      return next(new AppError("Mật khẩu mới không trùng khớp", 401));
    }
    const authPassword = await bcrypt.compare(matKhauCu, req.user.matKhau);
    if (!authPassword) {
      return next(new AppError("Mật khẩu hiện tại không chính xác", 401));
    }
    const result = await NguoiDungService.changePasswordNguoiDung({ taiKhoan, matKhauCu, matKhauMoi, nhapLaiMatKhauMoi });
    _io.to(taiKhoan).emit("sign-out-user");
    return new OkResponse({ message: "Đổi mật khẩu thành công" }).send(res);
  });

  getThongTinDoiHinhUser = catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const user = await NguoiDungService.getDoiHinhNguoiDung({ userID: _id });
    return new OkResponse({ data: user }).send(res);
  });
}

module.exports = new NguoiDungController();
