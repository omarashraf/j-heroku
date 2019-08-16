const { Order, validateOrder } = require('../models/order');
const { User, validateUser } = require('../models/user');
const { Product } = require('../models/product');

const mongoose = require('mongoose');

async function getAllOrders(req, res) {
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
                msg: 'non-exitent user id supplied'
            });
        }
    }

    let productDetails = await getProductsIdsAndPrice(req.body.orderDetails);
    if (productDetails.resolved) {
        let price = productDetails.price;
        let orderDetails = productDetails.orderDetails;

        let order = new Order({
            price,
            customerId: userId,
            orderDetails
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

async function getProductsIdsAndPrice(orderDetails) {
    let newOrderDetails = [];
    let nonExistentCode = false;
    let price = 0;

    for (let i = 0; i < orderDetails.length; i++) {
        let orderDetail = orderDetails[i];
        let product = await Product.findOne({ code: orderDetail.code });
        if (product) {
            newOrderDetails.push({ quantity: orderDetail.quantity, code: orderDetail.code });
            price += orderDetail.quantity * product.price;
        } else {
            nonExistentCode = true;
            break;
        }
    }

    if (nonExistentCode) {
        return {
            resolved: false
        }
    }
    return {
        orderDetails: newOrderDetails,
        price,
        resolved: true
    }
}

function deleteOrder(req, res) {
    let orderId = req.params.id;
    if (orderId) {
        Order.findByIdAndRemove(orderId, function(err) {
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
    let productDetails = await getProductsIdsAndPrice(req.body.orderDetails);
    if (productDetails.resolved) {
        let price = productDetails.price;

        newOrder = req.body;
        newOrder['price'] = price;
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

module.exports = {
    getAllOrders,
    getOrderById,
    insertOrder,
    deleteOrder,
    editOrder
}