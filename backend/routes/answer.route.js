const express = require('express');
const { answerValidation } = require('../validations');
const { answerController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
// permissão de manageAnswers <--
const router = express.Router();

router
  .route('/')
  .get(answerController.getAnswers)
  .post(validate(answerValidation.createAnswer), auth(), answerController.createAnswer);

router
  .route('/:answerId')
  .get(validate(answerValidation.getAnswer), answerController.getAnswer)
  .patch(validate(answerValidation.updateAnswer), auth(), answerController.updateAnswer)
  .delete(validate(answerValidation.deleteAnswer), auth(), answerController.deleteAnswer);

router
  .route('/question/:questionId')
  .get(validate(answerValidation.getAnswersByQuestionId), answerController.getAnswersByQuestionId);

module.exports = router;
