const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tagsRelationService } = require('../services');
const { pick, ApiError } = require('../utils');

const createTagRelation = catchAsync(async (req, res) => {
  try {
    const tagRelation = await tagsRelationService.createTagRelation(req.body);
    res.status(httpStatus.CREATED).send(tagRelation);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getTagRelations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['questionId', 'tagId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  try {
    const result = await tagsRelationService.queryTagRelations(filter, options);
    res.send(result);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getTagRelation = catchAsync(async (req, res) => {
  try {
    const tagRelation = await tagsRelationService.getTagRelationById(req.params.tagRelationId);
    res.send(tagRelation);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const updateTagRelation = catchAsync(async (req, res) => {
  try {
    const tagRelation = await tagsRelationService.updateTagRelationById(req.params.tagRelationId, req.body);
    res.send(tagRelation);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const deleteTagRelation = catchAsync(async (req, res) => {
  try {
    await tagsRelationService.deleteTagRelationById(req.params.tagRelationId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

module.exports = {
  createTagRelation,
  getTagRelations,
  getTagRelation,
  updateTagRelation,
  deleteTagRelation,
};
