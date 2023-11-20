const express = require('express');
const { rootController } = require('../controllers');

const router = express.Router();

router.route('/').get(rootController.helloWorld);

module.exports = router;
