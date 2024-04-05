const express = require('express');
const { questionValidation } = require('../validations');
const { questionController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(questionController.getQuestions)
  .post(auth(), validate(questionValidation.createQuestion), questionController.createQuestion);

router
  .route('/:questionId')
  .get(validate(questionValidation.getQuestion), questionController.getQuestion)
  .patch(
    questionController.attachQuestion,
    auth('manageQuestions'),
    validate(questionValidation.updateQuestion),
    questionController.updateQuestion,
  )
  .delete(questionController.attachQuestion, auth('manageQuestions'), questionController.deleteQuestion);

module.exports = router;
