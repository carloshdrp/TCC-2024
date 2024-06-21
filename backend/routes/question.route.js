const express = require('express');
const { questionValidation } = require('../validations');
const { questionController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const pointsMiddleware = require('../middlewares/points');

const router = express.Router();

router
  .route('/')
  .get(questionController.getQuestions)
  .post(
    validate(questionValidation.createQuestion),
    auth(),
    pointsMiddleware.setPoints('createQuestion'),
    questionController.createQuestion,
  );

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
    pointsMiddleware.setPoints('deleteQuestion'),
    questionController.deleteQuestion,
  );

module.exports = router;
