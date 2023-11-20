const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createPost = async (postBody, authorId) => {
  return prisma.post.create({
    data: {
      ...postBody,
      author: {
        connect: { id: authorId },
      },
    },
  });
};

const queryPosts = async (filter, options) => {
  const posts = await prisma.post.findMany({
    where: filter,
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
    include: {
      comments: true,
    },
  });

  return posts;
};

const getPostById = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      comments: true,
    },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post não encontrado');
  }

  return post;
};

const updatePostById = async (postId, updateBody) => {
  const post = await getPostById(postId);

  if (post.solved) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Este post já foi resolvido e não pode ser modificado.');
  }

  return prisma.post.update({
    where: { id: postId },
    data: updateBody,
  });
};

const deletePostById = async (postId) => {
  await getPostById(postId);

  return prisma.post.delete({
    where: { id: postId },
  });
};

module.exports = {
  createPost,
  queryPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
