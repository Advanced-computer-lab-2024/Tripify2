const express = require("express");
const router = express.Router();

const {
    getComplaints,
    createComplaint,
    createReply,
    updateStatus,
} = require("../controllers/complaintController");

const verifyAdmin = require('../middleware/verifyAdminOnly')
const verifyTourist = require('../middleware/verifyTouristOnly')
const verifyAdminTourist = require('../middleware/verifyJWT')

router.route("/")
    .get(verifyAdminTourist, getComplaints)
    .post(verifyTourist, createComplaint);

router.route("/reply/:id").post(verifyAdmin, createReply);

router.route("/update-status/:id").patch(verifyAdmin, updateStatus);


module.exports = router;
