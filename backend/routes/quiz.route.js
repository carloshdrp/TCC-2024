const express = require('express');
const { quizValidation, quizAttemptValidation } = require('../validations');
const { quizController, quizAttemptController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(quizController.getQuizzes)
  .post(validate(quizValidation.createQuiz), auth(), quizController.createQuiz);

router
  .route('/feedback/')
  .get(validate(quizAttemptValidation.getQuizAttempts), quizAttemptController.getQuizAttempts)
  .post(validate(quizAttemptValidation.createQuizAttempt), auth(), quizAttemptController.createQuizAttempt);

router
  .route('/feedback/:quizFeedbackId')
  .delete(validate(quizAttemptValidation.deleteQuizAttempt), auth(), quizAttemptController.deleteQuizAttempt);

router
  .route('/feedback/:quizId/score')
  .get(validate(quizAttemptValidation.getQuizScore), quizAttemptController.getQuizScore);

router
  .route('/:quizId')
  .get(validate(quizValidation.getQuiz), quizController.getQuiz)
  .patch(validate(quizValidation.updateQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.updateQuiz)
  .delete(validate(quizValidation.deleteQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.deleteQuiz);

module.exports = router;
