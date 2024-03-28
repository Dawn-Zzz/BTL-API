const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const passport = require("passport");
require("dotenv").config();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const loginWithGoogle = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const loginWithGoogleCallback = async (req, res, next) => {
  passport.authenticate("google", async (profile) => {
    try {
      if (!profile) {
        throw {
          code: 1,
          message: "Đăng nhập thất bại. Hãy thử lại",
        };
      }

      const id = new ObjectId(Buffer.from(profile.id).toString('hex').slice(0, 24));

      let user = await User.findById(id);

      if (!user) {
        user = await User.create({
          _id: id,
          name: profile.displayName,
          email: profile.emails[0].value,
          pic: profile.photos[0].value,
        });
      }

      res.cookie("userInfo", {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      }, {
        maxAge: 24 * 60 * 60 * 1000,
      });


       res.redirect("http://localhost:3000");
    } catch (error) {
      console.log(error);
      res.redirect("http://localhost:5000/auth/google");
    }
  })(req, res, next);
};

module.exports = { registerUser, authUser, allUsers,loginWithGoogle, loginWithGoogleCallback  };
