const express = require('express');
const router = express.Router();

var userCtrl = require('../controllers/user');

// get all users
// router.route('').get(userCtrl.getAllUsers);

// get a specific user
// router.route('/:id').get();

// insert a new user
router.route('').post(userCtrl.insertUser);

// delete an existing user
// router.route('').delete();

// edit an exisitng user
// router.route('').patch();

module.exports = router;