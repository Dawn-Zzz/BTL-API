const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(profile);
    }
  )
);