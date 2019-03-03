const express = require('express');
const router = express.Router();

var orderCtrl = require('../controllers/order');

// get all orders
router.route('').get(orderCtrl.getAllOrders);

// get a specific order
// router.route('/:id').get();

// insert a new order
// router.route('').post();

// delete an existing order
// router.route('').delete();

// edit an exisitng order
// router.route('').patch();

module.exports = router;