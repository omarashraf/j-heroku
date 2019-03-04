const express = require('express');
const router = express.Router();

var productCtrl = require('../controllers/product');

// get all products
// router.route('').get(productCtrl.getAllProducts);

// get a specific product
// router.route('/:id').get();

// insert a new product
router.route('').post(productCtrl.insertProduct);

// delete an existing product
// router.route('').delete();

// edit an exisitng product
// router.route('').patch();

module.exports = router;