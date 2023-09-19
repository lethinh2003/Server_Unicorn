const catchAsync = require("../utils/catch_async");
const AppError = require("../utils/app_error");
const AuthService = require("../services/auth.service");
const KeyService = require("../services/key.service");
const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
class AuthController {
  //PROTECT//
  protect = catchAsync(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 400));
    }
    const keyStore = await KeyService.findByUserID({
      userId,
    });
    if (!keyStore) {
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 400));
    }
    let accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken || !accessToken.startsWith("Bearer")) {
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 400));
    }
    accessToken = accessToken.split(" ")[1];
    const user = await AuthService.validateToken({ accessToken, publicKey: keyStore.publicKey, userId });
    req.user = user;
    req.keyStore = keyStore;

    next();
  });

  //PERMISSION//
  reStrictTo = (roles) => {
    return (req, res, next) => {
      if (AuthService.isPermission({ roles, userRole: req.user.role })) {
        next();
      }
    };
  };
}
module.exports = new AuthController();
