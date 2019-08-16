const express = require('express');
const router = express.Router();

var authCtrl = require('../controllers/auth.controller');

router.route('').post(authCtrl.authAdmin);

module.exports = router;
