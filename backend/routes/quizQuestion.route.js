const express = require('express');
const { quizQuestionValidation } = require('../validations');
const { quizQuestionController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(validate(quizQuestionValidation.getQuizQuestions), quizQuestionController.getQuizQuestions)
  .post(validate(quizQuestionValidation.createQuizQuestion), auth(), quizQuestionController.createQuizQuestion)
  .patch(validate(quizQuestionValidation.updateQuizQuestion), auth(), quizQuestionController.updateQuizQuestion)
  .delete(validate(quizQuestionValidation.deleteQuizQuestion), auth(), quizQuestionController.deleteQuizQuestion);

router
  .route('/:quizQuestionId')
  .get(validate(quizQuestionValidation.getQuizQuestion), quizQuestionController.getQuizQuestion);

module.exports = router;
