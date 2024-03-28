// const router = require("express").Router();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { loginWithGoogle, loginWithGoogleCallback } = require("../controllers/userControllers");

router.get("/google", loginWithGoogle);
router.get("/google/callback", loginWithGoogleCallback);


router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
