const jwt = require("jsonwebtoken");
const ms = require("ms");

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

module.exports = {
  createToken,
  verifyJWT,
};
