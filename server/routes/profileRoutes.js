const express = require("express");
const router = express.Router();
const {
  getCompanyProfiles,
  createCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
  getCompanyProfileById,
} = require("../controllers/profileController");
const verifyAdvertiser = require("../middleware/verifyAdvertiser");

router
  .route("/")
  .get(getCompanyProfiles)
  .post(verifyAdvertiser, createCompanyProfile)
  .patch(verifyAdvertiser, updateCompanyProfile)
  .delete(verifyAdvertiser, deleteCompanyProfile);

router.route("/:id").get(getCompanyProfileById);

module.exports = router;
