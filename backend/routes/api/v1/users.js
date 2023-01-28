const express = require("express");
const router = express.Router();

const usersController = require("../../../controllers/api/v1/users_api");

router.post("/add-user", usersController.register); // user registration - add a new user
// router.post("/login", usersController.login); // user login

module.exports = router;
