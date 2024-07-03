const express = require('express');
const { reportsValidation } = require('../validations');
const { reportsController } = require('../controllers');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(validate(reportsValidation.queryReports), auth('manageReports'), reportsController.queryReports)
  .post(validate(reportsValidation.createReport), auth(), reportsController.createReport);

router.route('/user/:userId').get(auth(), reportsController.queryReportsByUserId);

router
  .route('/:reportId')
  .patch(validate(reportsValidation.updateReportStatus), auth('manageReports'), reportsController.updateReportStatus);

module.exports = router;
