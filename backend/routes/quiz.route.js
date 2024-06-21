const express = require('express');
const { quizValidation, quizAttemptValidation } = require('../validations');
const { quizController, quizAttemptController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const pointsMiddleware = require('../middlewares/points');

const router = express.Router();

router
  .route('/')
  .get(quizController.getQuizzes)
  .post(validate(quizValidation.createQuiz), auth(), pointsMiddleware.setPoints('createQuiz'), quizController.createQuiz);

router
  .route('/feedback/')
  .get(validate(quizAttemptValidation.getQuizAttempts), quizAttemptController.getQuizAttempts)
  .post(
    validate(quizAttemptValidation.createQuizAttempt),
    auth(),
    pointsMiddleware.setPoints('quizPractice'),
    quizAttemptController.createQuizAttempt,
  );

router
  .route('/feedback/:quizAttemptId')
  .delete(validate(quizAttemptValidation.deleteQuizAttempt), auth(), quizAttemptController.deleteQuizAttempt)
  .get(validate(quizAttemptValidation.getQuizAttemptById), auth(), quizAttemptController.getQuizAttemptById);

router
  .route('/feedback/:quizId/score')
  .get(validate(quizAttemptValidation.getQuizScore), quizAttemptController.getQuizScore);

router
  .route('/:quizId')
  .get(validate(quizValidation.getQuiz), quizController.getQuiz)
  .patch(validate(quizValidation.updateQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.updateQuiz)
  .delete(
    validate(quizValidation.deleteQuiz),
    quizController.attachQuiz,
    auth('manageQuizzes'),
    pointsMiddleware.setPoints('deleteQuiz'),
    quizController.deleteQuiz,
  );

module.exports = router;
