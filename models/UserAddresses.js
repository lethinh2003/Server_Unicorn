const mongoose = require("mongoose");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const COLLECTION_NAME = "UserAddresses";
const userAddressesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    provine: {
      type: String,
      require: [true, USER_MESSAGES.USER_PROVINE_MISSING],
    },
    district: {
      type: String,
      require: [true, USER_MESSAGES.USER_DISTRICT_MISSING],
    },
    ward: {
      type: String,
      require: [true, USER_MESSAGES.USER_WARD_MISSING],
    },
    full_name: {
      type: String,
      require: [true, USER_MESSAGES.NAME_MISSING],
    },
    phone_number: {
      type: String,
      require: [true, USER_MESSAGES.USER_PHONE_NUMBER_MISSING],
    },
    detail_address: {
      type: String,
      require: [true, USER_MESSAGES.USER_DETAIL_ADDRESS_MISSING],
    },
    default: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const UserAddresses = mongoose.model(COLLECTION_NAME, userAddressesSchema);
module.exports = UserAddresses;
