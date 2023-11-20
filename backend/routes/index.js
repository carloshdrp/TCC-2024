const express = require('express');
const rootRoute = require('./root.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const postRoute = require('./post.route');
const commentRoute = require('./comment.route');

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
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
