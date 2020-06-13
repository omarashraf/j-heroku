const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var utils = require('../utils/helper_functions');
const { upload } = require('../lib/middlewares');

var productCtrl = require('../controllers/product.controller');

// middleware for authentication
router.use(utils.authenticateToken);

// get all products
router.route('').get(productCtrl.getAllProducts);

// get a specific product
// router.route('/:id').get();

// delete an existing product
router.route('/:id').delete(productCtrl.deleteProduct);

// edit an exisitng product
router.route('').patch(productCtrl.editProduct);

// middleware for handling multipart image
router.use(upload.single('image'));

// middleware for parsing urlencoded body
router.use(bodyParser.urlencoded({ extended: false}));

// insert a new product
router.route('').post(productCtrl.insertProduct);

module.exports = router;