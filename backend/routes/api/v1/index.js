const express = require("express");
const router = express.Router();
const passport = require("../../../config/passport-jwt-strategy");

const usersController = require("../../../controllers/api/v1/online_order_api");

router.post("/add-user", usersController.register); // user registration - add a new user
router.post("/login-user", usersController.login); // user login
router.post("/add-order", passport.authenticate("jwt", { session: false }), usersController.addOrder);  // add new order (protected route)
router.get("/get-order/:id", passport.authenticate("jwt", { session: false }), usersController.getOrder);  // get all orders, of a user (protected route)


module.exports = router;
