const express = require('express');
const auth = require('../middlewares/auth');
const { userController } = require('../controllers');
const validate = require('../middlewares/validate');
const { userValidation } = require('../validations');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(userController.attachUser, auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(userController.attachUser, auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(userController.attachUser, auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

router.route('/ranking/:userId').get(userController.attachUser, auth('getRanking'), userController.getRanking);

module.exports = router;
