const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth")
const postController = require("../controllers/post")


router.post("/addpost",checkAuth,postController.create)
router.get("/getallposts",checkAuth,postController.getAllPosts)
router.get("/getuserposts/:userId",checkAuth,postController.getUserPosts)
router.get("/getusersavedposts",checkAuth,postController.getUserSavedPosts)
router.get("/getlikedusers/:postId",checkAuth,postController.getLikedUsers)
router.post("/addsavedpost/:postId",checkAuth,postController.addToSavedPosts)
router.post("/removesavedpost/:postId",checkAuth,postController.removeFromSavedPosts)
router.delete("/deletepost/:postId",checkAuth,postController.deletePost)


module.exports = router