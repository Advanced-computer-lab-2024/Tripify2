const express = require("express");
const router = express.Router();
const {
  getCompanyProfiles,
  createCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
  getCompanyProfileById,
} = require("../controllers/profileController");
router
  .route("/")
  .get(getCompanyProfiles)
  .post(createCompanyProfile)
  .put(updateCompanyProfile)
  .delete(deleteCompanyProfile);

router.route("/:id").get(getCompanyProfileById);

module.exports = router;
