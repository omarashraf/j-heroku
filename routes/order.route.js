const express = require('express');
const router = express.Router();

var orderCtrl = require('../controllers/order.controller');
var utils = require('../utils/helper_functions');

// middleware for authentication
router.use(utils.authenticateToken);

// get all orders
router.route('').get(orderCtrl.getAllOrders);

// total revenue of all orders
router.route('/revenue').get(orderCtrl.getRevenue);

// get rankings of users with number of orders
router.route('/rankings').get(orderCtrl.getRankings);

// get a specific order
router.route('/:id').get(orderCtrl.getOrderById);

// insert a new order
router.route('').post(orderCtrl.insertOrder);

// delete an existing order
router.route('/:id').delete(orderCtrl.deleteOrder);

// edit an exisitng order
router.route('').patch(orderCtrl.editOrder);

module.exports = router;