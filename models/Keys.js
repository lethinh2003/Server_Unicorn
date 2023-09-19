const mongoose = require("mongoose");

const COLLECTION_NAME = "Keys";

const keySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    public_key: {
      type: String,
      require: true,
    },
    private_key: {
      type: String,
      require: true,
    },
    refresh_tokens_used: {
      type: Array,
      default: [],
    },
    refresh_tokens: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const Keys = mongoose.model(COLLECTION_NAME, keySchema);
module.exports = Keys;
