const jwt = require("jsonwebtoken");
const ms = require("ms");
const { UnauthorizedError } = require("./app_error");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const UserRepository = require("../models/repositories/user.repository");

const EXPIRES_IN = {
  ACCESS_TOKEN: process.env.JWT_ACCESSTOKEN_EXPIRED,
  REFRESH_TOKEN: process.env.JWT_REFRESHTOKEN_EXPIRED,
};

const createToken = ({ payload, publicKey, privateKey }) => {
  const accessToken = jwt.sign(payload, publicKey, {
    expiresIn: EXPIRES_IN.ACCESS_TOKEN,
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: EXPIRES_IN.REFRESH_TOKEN,
  });

  const expireAccessToken = Math.round(Date.now() + ms(EXPIRES_IN.ACCESS_TOKEN));
  return {
    accessToken,
    refreshToken,
    expireAccessToken,
  };
};

const verifyJWT = ({ token, secretKey }) => {
  const decode = jwt.verify(token, secretKey);
  return decode;
};

const validateUserToken = async ({ accessToken, publicKey, userId }) => {
  const decode = jwt.verify(accessToken, publicKey);
  if (decode.id.toString() !== userId.toString()) {
    throw new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED);
  }
  const user = await UserRepository.findOne({ query: { _id: decode.id } });
  if (!user) {
    throw new UnauthorizedError(USER_MESSAGES.LOGIN_REQUIRED);
  }
  return user;
};

module.exports = {
  createToken,
  verifyJWT,
  validateUserToken,
};
