const express = require('express');
const { quizRelationValidation } = require('../validations');
const { quizRelationController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(quizRelationController.queryQuizRelations)
  .post(auth(), validate(quizRelationValidation.createQuizRelation), quizRelationController.createQuizRelation);

router
  .route('/:quizRelationId')
  .get(validate(quizRelationValidation.getQuizRelation), quizRelationController.getQuizRelation)
  .patch(auth(), validate(quizRelationValidation.updateQuizRelation), quizRelationController.updateQuizRelation)
  .delete(auth(), validate(quizRelationValidation.deleteQuizRelation), quizRelationController.deleteQuizRelation);

module.exports = router;
