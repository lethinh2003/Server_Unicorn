"use strict";
const Keys = require("../models/Keys");

class KeysService {
  static createKeyPair = async ({ userID, refreshToken, privateKey, publicKey }) => {
    const key = await Keys.findOneAndUpdate(
      {
        user: userID,
      },
      {
        $push: { refresh_tokens: refreshToken },
        private_key: privateKey,
        public_key: publicKey,
      },
      {
        upsert: true,
        new: true,
      }
    );
    return key;
  };

  static findByUserID = async ({ userId }) => {
    const data = await Keys.findOne({
      user: userId,
    }).lean();
    return data;
  };
  static findByRefreshTokensUsed = async ({ refreshToken }) => {
    const data = await Keys.findOne({
      refresh_tokens_used: refreshToken,
    }).lean();
    return data;
  };
  static findByRefreshToken = async ({ refreshToken }) => {
    const data = await Keys.findOne({
      refresh_tokens: refreshToken,
    }).populate("user");
    return data;
  };
  static deleteByID = async ({ ID }) => {
    const data = await Keys.findOneAndRemove({
      _id: ID,
    });
    return data;
  };
  static deleteByUserId = async ({ userId, options = {} }) => {
    const data = await Keys.findOneAndDelete(
      {
        user: userId,
      },
      options
    );
    return data;
  };
  static deleteByUserIdAndRT = async ({ userId, refreshToken }) => {
    const data = await Keys.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $pull: { refresh_tokens: refreshToken },
      },
      {
        upsert: false,
        new: true,
      }
    );
    if (data && data.refresh_tokens.length === 0) {
      await data.delete();
    }

    return data;
  };
}
module.exports = KeysService;
