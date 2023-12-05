const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message");
const checkAuth = require("../middleware/checkAuth");


const router = express.Router();

router.route("/:chatId").get(checkAuth, allMessages);
router.route("/").post(checkAuth, sendMessage);

module.exports = router;