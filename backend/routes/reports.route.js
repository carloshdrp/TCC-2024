const express = require('express');
const { reportsValidation } = require('../validations');
const { reportsController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(validate(reportsValidation.queryReports), auth('manageReports'), reportsController.queryReports)
  .post(validate(reportsValidation.createReport), auth(), reportsController.createReport)
  .delete(validate(reportsValidation.deleteReport), auth('manageReports'), reportsController.deleteReport);

module.exports = router;
