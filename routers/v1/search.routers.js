const express = require("express");
const searchController = require("../../controllers/search.controller");

const router = express.Router();
router.route("/").get(searchController.searchProduct);

module.exports = router;
