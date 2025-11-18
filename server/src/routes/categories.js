const express = require('express');
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const validateRequest = require('../middleware/validateRequest');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/categoryValidator');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(validateRequest(createCategorySchema), createCategory);
router
  .route('/:idOrSlug')
  .get(getCategory)
  .put(validateRequest(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

module.exports = router;

