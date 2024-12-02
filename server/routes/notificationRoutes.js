const express = require("express");
const router = express.Router();

const { getNotifications, markAsRead } = require("../controllers/notificationController");

const verifyJWT = require("../middleware/verifyJWT");

router.route("/")
    .get(verifyJWT, getNotifications);

router.route("/:id")
    .patch(verifyJWT, markAsRead);

module.exports = router;