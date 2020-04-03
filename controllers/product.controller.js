const { Product, validateProduct } = require('../models/product.model');
const { Order, validateOrder } = require('../models/order.model');

async function getAllProducts(req, res) {
    let products = await Product.find();
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
        Order.find({ orderDetails: { $elemMatch: { code: productId } } }, function(err, order) {
            if (!order || order.length ===  0) {
                Product.findOneAndRemove({ code: productId }, function(err) {
                    if (err) {
                        res.status(500).send({
                            msg: err.message
                        });
                    } else {
                        res.status(200).send({
                            msg: 'product deleted successfully',
                            productId
                        })
                    }
                });
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