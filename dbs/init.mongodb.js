const mongoose = require("mongoose");
const {
  db: { stringConnect },
} = require("../configs/config.mongodb");

const nodeENV = process.env.NODE_ENV || "development";
class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    mongoose
      .connect(stringConnect, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB connected");
      })
      .catch((err) => {
        console.log("DB connect error");
      });
    // if (nodeENV === "development") {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", { color: true });
    // }
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
module.exports = Database.getInstance();
