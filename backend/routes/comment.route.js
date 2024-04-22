const express = require('express');
const { commentController } = require('../controllers');
const { commentValidation } = require('../validations');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(commentController.getComments)
  .post(validate(commentValidation.createComment), auth(), commentController.createComment);

router
  .route('/:commentId')
  .get(auth(), commentController.getComment)
  .patch(
    validate(commentValidation.updateComment),
    commentController.attachComment,
    auth('manageComments'),
    commentController.updateComment,
  )
  .delete(commentController.attachComment, auth('manageComments'), commentController.deleteComment);

module.exports = router;
