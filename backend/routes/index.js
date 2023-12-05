const express = require("express");
const router = express.Router();

// Authentication Router
router.get("/",(req,res)=>{res.send("")})
router.use("/foxial/auth",require("./auth.js"))

// Getting user details router

router.use("/auth",require("./auth.js"))

router.use("/foxial/api/user",require("./user.js"))

router.use("/foxial/api/post",require("./post.js"))

router.use("/foxial/api/comment",require("./comment.js"))

router.use("/foxial/api/like",require("./like.js"))

router.use("/foxial/api/friendship",require("./friendship.js"))

router.use("/foxial/api/chat",require("./chat.js"))

router.use("/foxial/api/message",require("./message.js"))

module.exports = router