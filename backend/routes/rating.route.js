const express = require('express');
const { ratingValidation } = require('../validations');
const { ratingController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const leagueChecker = require('../middlewares/badge');

const router = express.Router();

router
  .route('/')
  .get(ratingController.getRatings)
  .post(validate(ratingValidation.createRating), auth(), leagueChecker(), ratingController.createRating);

router
  .route('/:ratingId')
  .get(validate(ratingValidation.getRating), ratingController.getRating)
  .delete(validate(ratingValidation.deleteRating), auth(), leagueChecker(), ratingController.deleteRating);

router.route('/user/:userId').get(validate(ratingValidation.getRatingByUserId), ratingController.getRatingByUserId);
router.get('/user/:userId/received', auth(), ratingController.getUserReceivedRatings);

router
  .route('/type/:rateableType')
  .get(validate(ratingValidation.getRatingByRateableType), ratingController.getRatingByRateableType);

router
  .route('/rateable/:rateableId')
  .get(validate(ratingValidation.getRatingByRateableId), ratingController.getRatingByRateableId);

module.exports = router;
