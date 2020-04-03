const express = require('express');
const router = express.Router();

var userCtrl = require('../controllers/user.controller');

var utils = require('../utils/helper_functions');

// middleware for authentication
router.use(utils.authenticateToken);

// get all users
router.route('').get(userCtrl.getAllUsers);

// get a specific user
router.route('/:id?').get(userCtrl.getUser);

// insert a new user
router.route('').post(userCtrl.insertUser);

// delete an existing user
router.route('/:id').delete(userCtrl.deleteUser);

// edit an exisitng user
router.route('').patch(userCtrl.editUser);

module.exports = router;