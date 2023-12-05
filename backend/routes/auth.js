const express = require("express");
const router = express.Router();
const userAuth = require("../controllers/auth");


// For Signup
router.post("/signup",userAuth.userSignup)


// For Login
router.post("/user/login",userAuth.userLogin)

module.exports = router