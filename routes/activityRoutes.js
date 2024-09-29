const express = require("express");
const router = express.Router();
const { getActivity, createActivity, updateActivity, deleteActivity, getActivityById } = require("../controllers/activityController");
//const verifyAdvertiser = require('../middleware/verifyAdvertiser')

router.route('/')
    .get(getActivity)
    .post(createActivity)
    .put( updateActivity)
    .delete(deleteActivity)
    router.route('/:id')
    .get(getActivityById)

module.exports = router
    