const express = require("express");
const router = express.Router();
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");
const verifyTourismGovernor = require('../middleware/verifyTourismGovernor')

router.route("/").get(getTags).post(verifyTourismGovernor, createTag);

router
  .route("/:id")
  .get(getTagById)
  .patch(verifyTourismGovernor, updateTag)
  .delete(verifyTourismGovernor, deleteTag);

module.exports = router;
