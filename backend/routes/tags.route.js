const express = require('express');
const { tagsValidation } = require('../validations');
const { tagsController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(tagsController.getTags)
  .post(validate(tagsValidation.createTag), auth('manageTags'), tagsController.createTag);

router
  .route('/:tagId')
  .get(validate(tagsValidation.getTag), tagsController.getTag)
  .patch(validate(tagsValidation.updateTag), auth('manageTags'), tagsController.updateTag)
  .delete(validate(tagsValidation.deleteTag), auth('manageTags'), tagsController.deleteTag);

module.exports = router;
