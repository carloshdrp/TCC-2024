const express = require('express');
const { answerValidation } = require('../validations');
const { answerController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const pointsMiddleware = require('../middlewares/points');

const router = express.Router();

router
  .route('/')
  .get(answerController.getAnswers)
  .post(
    validate(answerValidation.createAnswer),
    auth('createAnswer'),
    pointsMiddleware.setPoints('answerQuestion'),
    answerController.createAnswer,
  );

router
  .route('/:answerId')
  .get(validate(answerValidation.getAnswer), answerController.getAnswer)
  .patch(
    validate(answerValidation.updateAnswer),
    answerController.attachAnswer,
    auth('manageAnswers'),
    answerController.updateAnswer,
  )
  .delete(
    validate(answerValidation.deleteAnswer),
    answerController.attachAnswer,
    auth('manageAnswers'),
    pointsMiddleware.setPoints('deleteAnswer'),
    answerController.deleteAnswer,
  );

router
  .route('/question/:questionId')
  .get(validate(answerValidation.getAnswersByQuestionId), answerController.getAnswersByQuestionId);

module.exports = router;
