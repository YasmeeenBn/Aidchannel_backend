var user2 = require("../models/user2");
var country = require("../models/country");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res, next) => {
  const userr = new user2(req.body);
  try {
    await userr.save();
    userr.hashed_Password=undefined;
    userr.salt=undefined;
    res.status(200).json(userr);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  user2.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: " user not found please , sign up !!",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match",
      });
    }
    const token = jwt.sign({ _id: user._id ,role:user.role}, process.env.JWT_SECRET);
    res.cookie("token", token, { expire: new Date() + 8060000 });
    const { _id, fullname, email, role } = user;
    return res.json({
      token,
      user: { _id, fullname, email, role },
    });
  });
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout",
  });
};

