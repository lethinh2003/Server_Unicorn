const catchAsync = require("../utils/catch_async");
const AuthService = require("../services/auth.service");
const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
class AuthController {
  //PROTECT//
  protect = catchAsync(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    const { user, keyStore } = await AuthService.protect({ userId, accessToken });
    req.user = user;
    req.keyStore = keyStore;
    next();
  });

  //PERMISSION//
  reStrictTo = (roles = ["user"]) => {
    return catchAsync(async (req, res, next) => {
      if (AuthService.reStrictTo({ roles, userRole: req.user.role, next })) {
        next();
      }
    });
  };
}
module.exports = new AuthController();
