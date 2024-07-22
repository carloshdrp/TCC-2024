const express = require('express');
const auth = require('../middlewares/auth');
const { userController } = require('../controllers');
const validate = require('../middlewares/validate');
const { userValidation } = require('../validations');
const { getUserAchievements } = require('../controllers/achievement.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), auth('manageUsers'), userController.createUser)
  .get(validate(userValidation.getUsers), auth('getUsers'), userController.getUsers);

router.route('/count').get(userController.getUserCount);

router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.attachUser, auth('getUsers'), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.attachUser, auth('manageUsers'), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.attachUser, auth('manageUsers'), userController.deleteUser);

router
  .route('/:userId/achievements')
  .get(validate(userValidation.getUser), userController.attachUser, auth('getUsers'), getUserAchievements);
router.route('/ranking/:userId').get(userController.getRanking);

router.route('/league/:userId').get(userController.getLeague);

module.exports = router;
