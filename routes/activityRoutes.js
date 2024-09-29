const express = require("express");
const router = express.Router();
const { getActivity, createActivity, updateActivity, deleteActivity, getActivityById } = require("../controllers/activityController");
//const verifyAdvertiser = require('../middleware/verifyAdvertiser')

router.route('/')
    .get(getActivity)
    .get(getActivityById)
    .post(createActivity)
    .put( updateActivity)
    .delete(deleteActivity)

module.exports = router
    