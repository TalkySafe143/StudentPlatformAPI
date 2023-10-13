const express = require("express");
const router = express.Router();

const authController = require("./authController");

require("../../utils/auth/strategies/basic");

router.post("/login", authController.login);

router.post("/register", authController.register);

module.exports = router;