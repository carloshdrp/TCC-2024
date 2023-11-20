const express = require('express');
const { commentController } = require('../controllers');
const { commentValidation } = require('../validations');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(commentController.getComments)
  .post(auth(), validate(commentValidation.createComment), commentController.createComment);

router
  .route('/:commentId')
  .get(auth(), commentController.getComment)
  .patch(
    commentController.attachComment,
    auth('manageComments'),
    validate(commentValidation.updateComment),
    commentController.updateComment,
  )
  .delete(commentController.attachComment, auth('manageComments'), commentController.deleteComment);

module.exports = router;
