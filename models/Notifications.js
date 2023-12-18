const mongoose = require("mongoose");
const { NOTIFICATION_TYPES, NOTIFICATION_MESSAGES } = require("../configs/config.notifications");
const COLLECTION_NAME = "Notifications";
const notificationsSchema = new mongoose.Schema(
  {
    receive_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      require: [true, NOTIFICATION_MESSAGES.RECEIVE_USER_MISSING],
    },
    type: {
      type: String,
      require: [true, NOTIFICATION_MESSAGES.TYPE_MISSING],
      enum: [NOTIFICATION_TYPES.DISCOUNT, NOTIFICATION_TYPES.ORDER],
    },
    title: {
      type: String,
      require: [true, NOTIFICATION_MESSAGES.TITLE_MISSING],
    },
    image: {
      type: String,
      require: [true, NOTIFICATION_MESSAGES.IMAGE_MISSING],
    },
    content: {
      type: String,
      require: [true, NOTIFICATION_MESSAGES.CONTENT_MISSING],
    },
    options: {
      type: Object,
      default: {},
    },
    status: {
      type: Boolean,
      default: true,
    },
    is_viewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const Notifications = mongoose.model(COLLECTION_NAME, notificationsSchema);
module.exports = Notifications;
