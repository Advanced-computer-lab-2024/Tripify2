const express = require("express");
const router = express.Router();
const { getTransportation, getTransportations } = require("../controllers/transportationController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/")
    .get(verifyJWT, getTransportations);

router.route('/:id')
    .get(verifyJWT, getTransportation);

module.exports = router;