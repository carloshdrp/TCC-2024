const express = require('express');
const auth = require('../middlewares/auth');
const { userController } = require('../controllers');

const router = express.Router();

router.route('/').post(auth('manageUsers'), userController.createUser).get(auth('getUsers'), userController.getUsers);

router
  .route('/:userId')
  .get(userController.attachUser, auth('getUsers'), userController.getUser)
  .patch(userController.attachUser, auth('manageUsers'), userController.updateUser)
  .delete(userController.attachUser, auth('manageUsers'), userController.deleteUser);

module.exports = router;
