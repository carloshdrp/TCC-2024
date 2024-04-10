/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createTagRelation = async (tagRelationBody) => {
  const tagRelation = await prisma.questionTags.create({
    data: tagRelationBody,
  });

  return tagRelation;
};

const queryTagRelations = async (filter, options) => {
  const tagRelations = await prisma.questionTags.findMany({
    where: filter,
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
  });

  return tagRelations;
};

const getTagRelationById = async (tagRelationId) => {
  const tagRelation = await prisma.questionTags.findUnique({
    where: { id: tagRelationId },
  });

  if (!tagRelation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Relação de tag não encontrada');
  }

  return tagRelation;
};

const updateTagRelationById = async (tagRelationId, updateBody) => {
  const tagRelation = await getTagRelationById(tagRelationId);

  return prisma.questionTags.update({
    where: { id: tagRelationId },
    data: updateBody,
  });
};

const deleteTagRelationById = async (tagRelationId) => {
  const tagRelation = await getTagRelationById(tagRelationId);

  return prisma.questionTags.delete({
    where: { id: tagRelationId },
  });
};

module.exports = {
  createTagRelation,
  queryTagRelations,
  getTagRelationById,
  updateTagRelationById,
  deleteTagRelationById,
};
