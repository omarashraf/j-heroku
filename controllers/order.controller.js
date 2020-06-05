const { Order, validateOrder } = require('../models/order.model');
const { User, validateUser } = require('../models/user.model');
var utils = require('../utils/helper_functions');

async function getAllOrders(req, res) {
    if (req.query.meta === 'true') {
        let count = await Order.countDocuments();
        if (count) {
            res.status(200).send({
                msg: 'orders count fetched successfully',
                count
            });
        } else {
            res.status(500).send({
                msg: 'could not fetch counter',
            });
        }
    } else {
        let orders = await Order.find();
        if (orders && orders.length > 0) {
            res.status(200).send({
                msg: 'orders fetched successfully',
                orders
            });
        } else {
            res.status(200).send({
                msg: 'there are no orders to be fetched',
                orders
            });
        }
    }
}

function getOrderById(req, res) {
    let orderId = req.params.id;
    if (orderId) {
        Order.findOne({ _id: orderId }, function(err, order) {
            if (!err) {
                res.status(200).send({
                    msg: 'order fetched by supplied id',
                    order
                });
            } else {
                res.status(404).send({
                    msg: 'no such order with the supplied id'
                });
            }
        });
    } else {
        res.status(400).send({
            msg: 'no order id is supplied'
        });
    }
}

async function insertOrder(req, res) {
    const { error } = validateOrder(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }
    let userId;
    let user = req.body.user;
    if (user) {
        const { error } = validateUser(user);
        if (error) {
            return res.status(400).send(error['details'][0]['message']);
        }

        let userFetched = await User.findOne({ $or: [{instagramUsername:user.instagramUsername}, {email: user.email}] });
        if (userFetched) {
            return res.status(409).send({
                msg: 'user already exists, please insert a new user',
                user
            });
        } else {
            // insert user in db
            let userToInsert = new User({
                name: user.name,
                instagramUsername: user.instagramUsername,
                email: user.email,
                phone: user.phone,
                address: user.address
            });
            await userToInsert.save(function(err, user) {
                userId = user.instagramUsername;
            });
        }
    } else {
        if (req.body.customerId) {
            userId = req.body.customerId;
        } else {
            return res.status(500).send({
                msg: 'no Instagram username is supplied'
            });
        }
    }

    let productDetails = await (req.body.discountPercentage? utils.getProductsIdsAndPrice(req.body.orderDetails, req.body.discountPercentage) : utils.getProductsIdsAndPrice(req.body.orderDetails, 0));
    if (productDetails.resolved && utils.updateProductOnOrderInsert(req.body.orderDetails)) {
        let price = productDetails.price;
        let orderDetails = productDetails.orderDetails;

        let order = new Order({
            price,
            customerId: userId,
            orderDetails,
            deliveryDate: req.body.deliveryDate,
            discountPercentage: req.body.discountPercentage,
            type: req.body.type,
            special: req.body.special
        });

        await order.save();
        return res.status(200).send({
            msg: 'order inserted successfully',
            order
        });
    } else {
        return res.status(400).send({
            msg: 'product details were not set properly'
        });
    }

    
}

async function deleteOrder(req, res) {
    let orderId = req.params.id;
    let updatedProduct = await utils.updateProductOnOrderDelete(orderId);
    if (orderId && updatedProduct) {
        Order.findByIdAndRemove(orderId, function(err, order) {
            if (err) {
                res.status(500).send({
                    msg: err.message
                });
            } else {
                res.status(200).send({
                    msg: 'order deleted successfully',
                    orderId
                })
            }
        })
    } else {
        res.status(400).send({
            msg: 'no order id is supplied'
        });
    }
}

async function editOrder(req, res) {
    const { error } = validateOrder(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let newOrder;
    let productDetails = await (req.body.discountPercentage? utils.getProductsIdsAndPrice(req.body.orderDetails, req.body.discountPercentage) : utils.getProductsIdsAndPrice(req.body.orderDetails, 0));
    let updatedProduct = await utils.updateProductOnOrderEdit(req.body.orderDetails, req.body.preOrderDetails);
    if (productDetails.resolved && updatedProduct) {
        let price = productDetails.price;
        newOrder = req.body;
        newOrder['price'] = price;
        newOrder['deliveryDate'] = req.body.deliveryDate;
        newOrder['discountPercentage'] = req.body.discountPercentage;
        newOrder['type'] = req.body.type;
        newOrder['special'] = req.body.special;
    } else {
        return res.status(400).send({
            msg: 'product details were not set properly'
        });
    }

    Order.findOneAndUpdate({ _id: req.body.orderId }, newOrder, { new: true }, function(err, order) {
        if (!err) {
            res.status(200).send({
                msg: 'order updated successfully',
                order
            })
        } else {
            res.status(404).send({
                msg: 'no such order with the supplied id'
            });
        }
    });
}

async function getRevenue(req, res) {
    const result = await Order.aggregate([
        { $match: { 'status': 'delivered' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    if (result) {
        res.status(200).send({
            msg: 'orders revenues fetched',
            result
        });
    } else {

    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    insertOrder,
    deleteOrder,
    editOrder,
    getRevenue
}