const express = require('express');
const { postValidation } = require('../validations');
const { postController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(postController.getPosts).post(auth(), validate(postValidation.createPost), postController.createPost);

router
  .route('/:postId')
  .get(postController.getPost)
  .patch(postController.attachPost, auth('managePosts'), validate(postValidation.updatePost), postController.updatePost)
  .delete(postController.attachPost, auth('managePosts'), postController.deletePost);

module.exports = router;
