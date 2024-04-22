const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tagsService } = require('../services');
const { pick, ApiError } = require('../utils');

const createTag = catchAsync(async (req, res) => {
  try {
    const tag = await tagsService.createTag(req.body);
    res.status(httpStatus.CREATED).send(tag);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getTags = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  try {
    const result = await tagsService.queryTags(filter, options);
    res.send(result);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getTag = catchAsync(async (req, res) => {
  try {
    const tag = await tagsService.getTagById(req.params.tagId);
    res.send(tag);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const updateTag = catchAsync(async (req, res) => {
  try {
    const tag = await tagsService.updateTagById(req.params.tagId, req.body);
    res.send(tag);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const deleteTag = catchAsync(async (req, res) => {
  try {
    await tagsService.deleteTagById(req.params.tagId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

module.exports = {
  createTag,
  getTag,
  getTags,
  updateTag,
  deleteTag,
};
