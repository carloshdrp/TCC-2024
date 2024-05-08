const express = require('express');
const { quizValidation, quizFeedbackValidation } = require('../validations');
const { quizController, quizFeedbackController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(quizController.getQuizzes)
  .post(validate(quizValidation.createQuiz), auth(), quizController.createQuiz);

router
  .route('/feedback/')
  .get(validate(quizFeedbackValidation.getQuizFeedbacks), quizFeedbackController.getQuizFeedbacks)
  .post(validate(quizFeedbackValidation.createQuizFeedback), auth(), quizFeedbackController.createQuizFeedback);

router
  .route('/feedback/:quizFeedbackId')
  .delete(validate(quizFeedbackValidation.deleteQuizFeedback), auth(), quizFeedbackController.deleteQuizFeedback);

router
  .route('/:quizId')
  .get(validate(quizValidation.getQuiz), quizController.getQuiz)
  .patch(validate(quizValidation.updateQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.updateQuiz)
  .delete(validate(quizValidation.deleteQuiz), quizController.attachQuiz, auth('manageQuizzes'), quizController.deleteQuiz);

module.exports = router;
