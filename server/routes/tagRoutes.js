const express = require("express");
const router = express.Router();
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");
// const verifyAdmin = require('../middleware/verifyAdminOnly')

router.route("/").get(getTags).post(/*verifyAdmin,*/ createTag);

router
  .route("/:id")
  .get(getTagById)
  .patch(/*verifyAdmin,*/ updateTag)
  .delete(/*verifyAdmin, */ deleteTag);

module.exports = router;
