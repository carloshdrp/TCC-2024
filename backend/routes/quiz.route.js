const express = require('express');
const { quizValidation } = require('../validations');
const { quizController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(quizController.getQuizzes)
  .post(validate(quizValidation.createQuiz), auth(), quizController.createQuiz);

router
  .route('/:quizId')
  .get(validate(quizValidation.getQuiz), quizController.getQuiz)
  .patch(validate(quizValidation.updateQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.updateQuiz)
  .delete(validate(quizValidation.deleteQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.deleteQuiz);

module.exports = router;
