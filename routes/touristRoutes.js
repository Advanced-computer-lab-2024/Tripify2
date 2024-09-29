const express = require("express");
const router = express.Router();
const {
  createTourist,
  getTourists,
  getTourist,
  updateTourist,
  deleteTourist,
} = require("../controllers/touristController.js");

router.route("/tourist").get(getTourists).post(createTourist);
router
  .route("/tourist/:id")
  .get(getTourist)
  .patch(updateTourist)
  .delete(deleteTourist);

module.exports = router;
