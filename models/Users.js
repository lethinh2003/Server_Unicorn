const mongoose = require("mongoose");
const validator = require("validator");
const { USER_GENDERS } = require("../configs/config.user.genders");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const { USER_ROLES } = require("../configs/config.user.roles");
const { hashPassword } = require("../utils/hashPassword");
const COLLECTION_NAME = "Users";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, USER_MESSAGES.EMAIL_MISSING],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: USER_MESSAGES.EMAIL_INVALID,
      },
    },
    password: {
      type: String,
      trim: true,
      min: [8, USER_MESSAGES.PASSWORD_MIN_LENGTH],
      required: [true, USER_MESSAGES.PASSWORD_MISSING],
    },
    birthday: {
      type: Date,
      required: [true, USER_MESSAGES.BIRTHDAY_MISSING],
    },
    gender: {
      type: String,
      enum: [USER_GENDERS.MALE, USER_GENDERS.FEMALE],
      required: [true, USER_MESSAGES.GENDER_MISSING],
    },
    role: {
      type: String,
      enum: [USER_ROLES.USER, USER_ROLES.STAFF, USER_ROLES.ADMIN],
      default: USER_ROLES.USER,
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
// Run before create() fired
userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

const Users = mongoose.model(COLLECTION_NAME, userSchema);
module.exports = Users;
