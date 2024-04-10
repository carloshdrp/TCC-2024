const express = require('express');
const { tagsRelationValidation } = require('../validations');
const { tagsRelationController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(tagsRelationController.getTagRelations)
  .post(validate(tagsRelationValidation.createTagRelation), auth(), tagsRelationController.createTagRelation);

router
  .route('/:tagRelationId')
  .get(validate(tagsRelationValidation.getTagRelation), tagsRelationController.getTagRelation)
  .patch(validate(tagsRelationValidation.updateTagRelation), auth(), tagsRelationController.updateTagRelation)
  .delete(validate(tagsRelationValidation.deleteTagRelation), auth(), tagsRelationController.deleteTagRelation);

module.exports = router;
