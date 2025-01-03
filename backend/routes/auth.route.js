const express = require('express');
const validate = require('../middlewares/validate');
const { authValidation, userValidation } = require('../validations');
const { authController, avatarController } = require('../controllers');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/register', validate(userValidation.createUser), authController.register);

router.post('/avatar', upload.single('avatar'), avatarController.uploadAvatar);
router.delete('/avatar', avatarController.deleteAvatar);

router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

module.exports = router;
