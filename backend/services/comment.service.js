const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const { ApiError } = require('../utils');

const createComment = async (commentBody, userId) => {
  return prisma.comment.create({
    data: {
      ...commentBody,
      userId,
    },
  });
};

const getCommentById = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comentário não encontrado');
  }

  return comment;
};

const queryComments = async (filter, options) => {
  const comments = await prisma.comment.findMany({
    where: filter,
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
  });

  return comments;
};

const updateCommentById = async (commentId, updateBody) => {
  await getCommentById(commentId);

  return prisma.comment.update({
    where: { id: commentId },
    data: updateBody,
  });
};

const deleteCommentById = async (commentId) => {
  await getCommentById(commentId);

  return prisma.comment.delete({
    where: { id: commentId },
  });
};

module.exports = {
  createComment,
  getCommentById,
  queryComments,
  updateCommentById,
  deleteCommentById,
};
