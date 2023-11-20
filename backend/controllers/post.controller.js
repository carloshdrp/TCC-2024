const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');
const { pick, ApiError } = require('../utils');

const createPost = catchAsync(async (req, res) => {
  const authorId = req.user.id;
  const post = await postService.createPost(req.body, authorId);
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.postId, req.body);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

const attachPost = catchAsync(async (req, res, next) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post não encontrado');
  }
  req.post = post;
  req.resourceOwnerId = post.userId;
  next();
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  attachPost,
};
