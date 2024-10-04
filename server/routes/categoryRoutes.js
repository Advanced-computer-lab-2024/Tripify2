const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
// const verifyAdmin = require('../middleware/verifyAdminOnly')

router.route("/").get(getCategories).post(/*verifyAdmin,*/ createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .patch(/*verifyAdmin, */ updateCategory)
  .delete(/*verifyAdmin,*/ deleteCategory);

module.exports = router;
