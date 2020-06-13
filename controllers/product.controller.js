const { Product, validateProduct } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { unlink } = require('fs');
const DIR = '/products/';

async function getAllProducts(req, res) {
    let products = await Product.find();
    if (req.query.meta === 'true') {
        let productsCount = products.map(product => ({
            name: product.name,
            code: product.code,
            count: Number(product['quantity']) - Number(product['availableToSell'])
        }));
        res.status(200).send({
            msg: 'products count fetched successfully',
            productsCount
        });
    } else {
        if (products && products.length > 0) {
            res.status(200).send({
                msg: 'products fetched successfully',
                products
            });
        } else {
            res.status(200).send({
                msg: 'there are no products to be fetched',
                products
            });
        }
    }
}

async function insertProduct(req, res) {
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let product = await Product.findOne({ code: req.body.code });
    if (product) {
        return res.status(409).send({
            msg: 'product code already exists'
        });
    } else {
        // insert product in db
        product = new Product({
            name: req.body.name,
            code: req.body.code,
            price: req.body.price,
            quantity: req.body.quantity,
            availableToSell: req.body.quantity
        });
        product.imageName = req.file && req.file.filename ? DIR + req.file.filename : '';
        await product.save();
        return res.status(200).send({
            msg: 'product inserted successfully',
            product
        });
    }
}

function deleteProduct(req, res) {
    let productId = req.params.id;
    if (productId) {
        Order.find({ orderDetails: { $elemMatch: { code: productId } } }, async function(err, order) {
            if (!order || order.length ===  0) {
                let productFetched = await Product.findOne({ code: productId });
                if (productFetched.imageName || productFetched.imageName !== '') {
                    const urlSuffix = productFetched.imageName.split(':')[productFetched.imageName.split(':').length - 1];
                    const urlPath = urlSuffix.split('/').filter((element, index) => index != 0).join('/');
                    unlink('images/' + urlPath, (err) => {
                        if (err) {
                            return res.status(500).send({
                                msg: 'could not delete attached image'
                            });
                        }
                        Product.findOneAndRemove({ code: productId }, function(err) {
                            if (err) {
                                res.status(500).send({
                                    msg: err.message
                                });
                            } else {
                                res.status(200).send({
                                    msg: 'product deleted successfully',
                                    productId
                                });
                            }
                        });
                    });
                }
            } else {
                res.status(403).send({
                    msg: 'There is one or more order associated to that product'
                });
            }
        });
    } else {
        res.status(400).send({
            msg: 'no product id is supplied'
        });
    }
}

function editProduct(req, res) {
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        availableToSell: req.body.availableToSell,
        code: req.body.code
    }

    Product.findOneAndUpdate({ code: req.body.code }, newProduct, { new: true }, function(err, product) {
        if (!err) {
            res.status(200).send({
                msg: 'product updated successfully',
                product
            })
        } else {
            res.status(404).send({
                msg: 'no such product with the supplied id'
            });
        }
    });

}

module.exports = {
    insertProduct,
    getAllProducts,
    deleteProduct,
    editProduct
}