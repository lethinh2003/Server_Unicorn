const express = require("express");
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const adminUsersRouters = require("./admin.users.routers");
const router = express.Router();

// User Addresses Routers
router.use("/users", adminUsersRouters);

module.exports = router;
