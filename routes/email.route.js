const express = require('express');
const router = express.Router();

var utils = require('../utils/helper_functions');
const emailCtrl = require('../controllers/email.controller');

// middleware for authentication
router.use(utils.authenticateToken);

// send email to customers
router.route('').post(emailCtrl.sendEmail);

module.exports = router;