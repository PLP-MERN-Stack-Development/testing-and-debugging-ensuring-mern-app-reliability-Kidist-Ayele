const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require('../controllers/postController');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth');
const {
  createPostSchema,
  updatePostSchema,
} = require('../validators/postValidator');

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(protect, validateRequest(createPostSchema), createPost);
router
  .route('/:idOrSlug')
  .get(getPost)
  .put(protect, validateRequest(updatePostSchema), updatePost)
  .delete(protect, deletePost);

router.post('/:idOrSlug/comments', addComment);

module.exports = router;

