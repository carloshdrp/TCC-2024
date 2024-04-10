const express = require('express');
const rootRoute = require('./root.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const questionRoute = require('./question.route');
const commentRoute = require('./comment.route');
const tagsRoute = require('./tags.route');
const tagsRelationRoute = require('./tags-relation.route');

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
    path: '/tags-relation',
    route: tagsRelationRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
