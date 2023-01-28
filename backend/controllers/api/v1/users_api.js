const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.register = async function (req, res) {
  try {
    let user = await User.findOne({
      phone_number: req.body.phone_number,
    });

    if (!user) {
      // ::User does not already exist in DB, thus register new user
      const saltRounds = 10;
      user = await User.create({
        name: req.body.name,
        phone_number: req.body.phone_number,
        password: await bcrypt.hash(req.body.password, saltRounds), // storing hashed password in `password` field
        orders: [],
      });
      user = user.toObject(); // convert document to Javscript object
      return res.json(201, {
        message: `Success! ${user.name}, you are successfully registered on Voosh.`,
        data: {
          user: user,
        },
      });
    } 
    else {
      // ::User already exist in DB
      user = user.toObject();
      return res.json(409, {
        message: "Failure! User already exists. Please try signing in.",
        data: {
          user: user,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
