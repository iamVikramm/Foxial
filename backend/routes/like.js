const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth")
const like = require("../controllers/like")


router.post("/toggle",checkAuth,like.toggleLike)



module.exports = router