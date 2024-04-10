const express = require('express');
const { questionValidation } = require('../validations');
const { questionController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(questionController.getQuestions)
  .post(validate(questionValidation.createQuestion), auth(), questionController.createQuestion);

router
  .route('/:questionId')
  .get(validate(questionValidation.getQuestion), questionController.getQuestion)
  .patch(
    validate(questionValidation.updateQuestion),
    questionController.attachQuestion,
    auth('manageQuestions'),
    questionController.updateQuestion,
  )
  .delete(
    validate(questionValidation.deleteQuestion),
    questionController.attachQuestion,
    auth('manageQuestions'),
    questionController.deleteQuestion,
  );

module.exports = router;
