const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth")
const commentController = require("../controllers/comment")


router.post("/addcomment",checkAuth,commentController.create)
router.delete("/deletecomment",checkAuth,commentController.deleteComment)
// router.get("/getallposts",checkAuth,postController.getAllPosts)
// router.get("/getuserposts",checkAuth,postController.getUserPosts)


module.exports = router
