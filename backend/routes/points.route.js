const express = require('express');
const { pointsValidation } = require('../validations');
const { pointsController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/increment/:userId')
  .post(
    validate(pointsValidation.incrementPoints),
    pointsController.attachUser,
    auth('managePoints'),
    pointsController.incrementPoints,
  );

router
  .route('/decrement/:userId')
  .post(
    validate(pointsValidation.decrementPoints),
    pointsController.attachUser,
    auth('managePoints'),
    pointsController.decrementPoints,
  );

module.exports = router;
