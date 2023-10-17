const catchAsync = require("../utils/catch_async");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../utils/app_error");
const AuthService = require("../services/auth.service");
const KeysService = require("../services/keys.service");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
class AuthController {
  //PROTECT//
  protect = catchAsync(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      return next(new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED));
    }
    const keyStore = await KeysService.findByUserID({
      userId,
    });
    if (!keyStore) {
      return next(new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED));
    }
    let accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken || !accessToken.startsWith("Bearer")) {
      return next(new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED));
    }
    accessToken = accessToken.split(" ")[1];
    const user = await AuthService.validateToken({ accessToken, publicKey: keyStore.public_key, userId, next });
    req.user = user;
    req.keyStore = keyStore;
    next();
  });

  //PERMISSION//
  reStrictTo = (roles) => {
    return (req, res, next) => {
      if (AuthService.isPermission({ roles, userRole: req.user.role, next })) {
        next();
      }
    };
  };
}
module.exports = new AuthController();
