const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ratingService, badgeService } = require('../services');

const { pick, ApiError } = require('../utils');

const createRating = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { rateableId, rateableType } = req.body;
  const { resourceOwnerId, beforeProgress } = res.locals.ratingInfo;

  const rating = await ratingService.createRating(userId, rateableId, rateableType);

  const afterProgress = await badgeService.badgeProgress(resourceOwnerId);

  if (beforeProgress.newLeague !== afterProgress.newLeague) {
    await badgeService.updateUserLeague(resourceOwnerId, afterProgress.newLeague);
  }

  res.status(httpStatus.CREATED).send({ rating, badgeProgress: afterProgress });
});

const getRatings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['rateableId', 'rateableType', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ratingService.queryRatings(filter, options);
  res.send(result);
});

const getRating = catchAsync(async (req, res) => {
  const rating = await ratingService.getRatingById(req.params.ratingId);
  res.send(rating);
});

const getRatingByRateableId = catchAsync(async (req, res) => {
  const rating = await ratingService.getRatingByRateableId(req.params.rateableId);
  res.send(rating);
});

const getRatingByRateableType = catchAsync(async (req, res) => {
  const rating = await ratingService.getRatingByRateableType(req.params.rateableType);
  res.send(rating);
});

const getRatingByUserId = catchAsync(async (req, res) => {
  const rating = await ratingService.getRatingByUserId(req.params.userId, req.query.rateableId, req.query.rateableType);
  res.send(rating);
});

const getUserReceivedRatings = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const ratingsCount = await ratingService.getUserReceivedRatings(userId);
  res.status(httpStatus.OK).json({ count: ratingsCount });
});

const deleteRating = catchAsync(async (req, res) => {
  const { resourceOwnerId, beforeProgress } = res.locals.ratingInfo;

  await ratingService.deleteRatingById(req.body.userId, req.params.ratingId);

  const afterProgress = await badgeService.badgeProgress(resourceOwnerId);

  if (beforeProgress.newLeague !== afterProgress.newLeague) {
    await badgeService.updateUserLeague(resourceOwnerId, afterProgress.newLeague);
  }

  res.status(httpStatus.NO_CONTENT).send({ badgeProgress: afterProgress });
});

const attachRating = catchAsync(async (req, res, next) => {
  const rating = await ratingService.getRatingById(req.params.ratingId);
  if (!rating) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Avaliação não encontrada');
  }
  req.rating = rating;
  req.resourceOwnerId = rating.ratedBy.id;
  return next();
});

module.exports = {
  createRating,
  getRating,
  getRatings,
  getRatingByRateableId,
  getRatingByRateableType,
  getRatingByUserId,
  getUserReceivedRatings,
  deleteRating,
  attachRating,
};
