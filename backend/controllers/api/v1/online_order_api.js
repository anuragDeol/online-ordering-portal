const User = require("../../../models/user");
const Order = require("../../../models/order");
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
        message: `Success! ${user.name}, you are successfully registered.`,
        data: {
          user: user,
        },
      });
    } else {
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

module.exports.login = async function (req, res) {
  try {
    let user = await User.findOne({
      phone_number: req.body.phone_number,
    });
    if (!user) {
      return res.json(404, {
        message: "Failure! User not found. Please register first.",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.json(401, {
        message: "Failure! Incorrect credentials.",
      });
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: "3600000",
    });
    user = user.toObject();
    return res.json(200, {
      message: `Success! ${user.name}, you are logged in.`,
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.addOrder = async function (req, res) {
  try {
    const order = await Order.create({
      user: req.user._id, // link the order with the user who added it
      sub_total: req.body.sub_total,
      phone_number: req.body.phone_number,
    });

    const user = await User.findById(req.user._id);
    user.orders.push(order);
    user.save();

    return res.status(201).json({
      message: `Success! Order added by ${req.user.name}`,
      data: {
        order: order,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.getOrder = async function (req, res) {
  try {
    console.log(req.body);
    if(req.params.id != req.user.id) {
        return res.json(401, {
          message: "Not authorized to fetch someone else's details",
        });
    }
    const orders = await Order.find({
      user: req.params.id,
    });
    return res.status(201).json({
      message: `Success! ${req.user.name}, here are all the orders you placed`,
      data: {
        orders: orders,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
