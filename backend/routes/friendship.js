const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth")
const friendshipController = require("../controllers/friendship")

router.get("/getfriendshipsandpendingrequests",checkAuth,friendshipController.getAllFriendshipsAndPendingRequests)
router.post("/sendfriendrequest/:receiverId",checkAuth,friendshipController.sendRequest)
router.post("/acceptrequest/:senderId",checkAuth,friendshipController.acceptRequest)
router.post("/unfriend/:senderId",checkAuth,friendshipController.unFriend)
router.get("/getnonfriends",checkAuth,friendshipController.getNonFriends)



module.exports = router