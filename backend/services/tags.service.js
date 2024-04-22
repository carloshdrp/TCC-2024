/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createTag = async (tagBody) => {
  const tag = await prisma.tags.create({
    data: tagBody,
  });

  return tag;
};

const queryTags = async (filter, options) => {
  const tags = await prisma.tags.findMany({
    where: filter,
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
    include: {
      Question: true,
    },
  });

  return tags;
};

const getTagById = async (tagId) => {
  const tag = await prisma.tags.findUnique({
    where: { id: tagId },
    include: {
      QuestionTags: true,
    },
  });

  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag não encontrada');
  }

  return tag;
};

const updateTagById = async (tagId, updateBody) => {
  const tag = await getTagById(tagId);

  return prisma.tags.update({
    where: { id: tagId },
    data: updateBody,
  });
};

const deleteTagById = async (tagId) => {
  const tag = await getTagById(tagId);

  return prisma.tags.delete({
    where: { id: tagId },
  });
};

module.exports = {
  createTag,
  queryTags,
  getTagById,
  updateTagById,
  deleteTagById,
};
