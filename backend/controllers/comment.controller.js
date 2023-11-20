const httpStatus = require('http-status');
const { commentService } = require('../services');
const { ApiError, catchAsync, pick } = require('../utils');

const createComment = catchAsync(async (req, res) => {
  const authorId = req.user.id;
  const comment = await commentService.createComment(req.body, authorId);
  res.status(httpStatus.CREATED).send(comment);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  res.send(comment);
});

const getComments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.queryComments(filter, options);
  res.send(result);
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

// middleware
const attachComment = catchAsync(async (req, res, next) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comentário não encontrado');
  }
  req.comment = comment;
  req.resourceOwnerId = comment.userId;
  next();
});

module.exports = {
  createComment,
  getComment,
  getComments,
  updateComment,
  deleteComment,
  attachComment,
};
