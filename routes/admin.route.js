const express = require('express');
const router = express.Router();

var adminCtrl = require('../controllers/admin.controller');

router.route('').post(adminCtrl.insertAdmin);

module.exports = router;