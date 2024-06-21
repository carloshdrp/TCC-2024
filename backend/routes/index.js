const express = require('express');
const rootRoute = require('./root.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const questionRoute = require('./question.route');
const commentRoute = require('./comment.route');
const tagsRoute = require('./tags.route');
const ratingRoute = require('./rating.route');
const answerRoute = require('./answer.route');
const quizRoute = require('./quiz.route');
const quizQuestionRoute = require('./quizQuestion.route');
const quizRelationRoute = require('./quizRelation.route');
const reportsRoute = require('./reports.route');

const router = express.Router();

const routes = [
  {
    path: '/',
    route: rootRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/questions',
    route: questionRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/tags',
    route: tagsRoute,
  },
  {
    path: '/ratings',
    route: ratingRoute,
  },
  {
    path: '/answers',
    route: answerRoute,
  },
  {
    path: '/quiz',
    route: quizRoute,
  },
  {
    path: '/quiz-questions',
    route: quizQuestionRoute,
  },
  {
    path: '/quiz-relations',
    route: quizRelationRoute,
  },
  {
    path: '/reports',
    route: reportsRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
