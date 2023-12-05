const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");



// For Signup
router.get("/details",checkAuth,userController.getUserDetails)

// Update User Route
router.post("/update",checkAuth,userController.updateUserDetails)

router.get("/search",checkAuth,userController.searchUser)

router.get("/searchbyid/:userId",checkAuth,userController.searchUserById)

router.get("/checkusernameavailable",checkAuth,userController.checkUsernameAvailable)

router.post("/updateprivacy",checkAuth,userController.updatePrivacy)



module.exports = router




