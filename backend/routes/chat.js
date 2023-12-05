const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chat");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.route("/").post(checkAuth, accessChat);
router.route("/").get(checkAuth, fetchChats);
router.route("/group").post(checkAuth, createGroupChat);
router.route("/rename").put(checkAuth, renameGroup);
router.route("/groupremove").put(checkAuth, removeFromGroup);
router.route("/groupadd").put(checkAuth, addToGroup);

module.exports = router;