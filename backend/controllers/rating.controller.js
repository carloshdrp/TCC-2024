const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ratingService } = require('../services');
const { pick, ApiError } = require('../utils');

const createRating = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { rateableId, rateableType } = req.body;
  const rating = await ratingService.createRating(userId, rateableId, rateableType);
  res.status(httpStatus.CREATED).send(rating);
});

const getRatings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['rateableId', 'rateableType']);
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

const deleteRating = catchAsync(async (req, res) => {
  await ratingService.deleteRatingById(req.body.userId, req.params.ratingId);
  res.status(httpStatus.NO_CONTENT).send();
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
  deleteRating,
  attachRating,
};
