const express = require('express');
const { ratingValidation } = require('../validations');
const { ratingController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(ratingController.getRatings)
  .post(validate(ratingValidation.createRating), auth(), ratingController.createRating);

router
  .route('/:ratingId')
  .get(validate(ratingValidation.getRating), ratingController.getRating)
  .delete(validate(ratingValidation.deleteRating), auth(), ratingController.deleteRating);

router.route('/user/:userId').get(validate(ratingValidation.getRatingByUserId), ratingController.getRatingByUserId);

router
  .route('/type/:rateableType')
  .get(validate(ratingValidation.getRatingByRateableType), ratingController.getRatingByRateableType);

router
  .route('/rateable/:rateableId')
  .get(validate(ratingValidation.getRatingByRateableId), ratingController.getRatingByRateableId);

module.exports = router;
