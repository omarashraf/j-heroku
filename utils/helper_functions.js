const dotenv = require('dotenv');
const env = dotenv.config();
const jwt = require('jsonwebtoken');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const mongoose = require('mongoose');


function authenticateToken(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (decoded.exp * 1000 <= Date.now()) {
                return res.status(401).send({
                    msg: 'Token has expired'
                });
            } else if (err) {
                return res.status(401).send({
                    msg: 'Failed to authenticate token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).send({
            msg: 'No token provided'
        });
    }
}

async function getProductsIdsAndPrice(orderDetails, discountPercentage) {
    let newOrderDetails = [];
    let nonExistentCode = false;
    let price = 0;
    let socksCount = 0;
    let ordersPackMap = {};
    for (let i = 0; i < orderDetails.length; i++) {
        if (ordersPackMap[orderDetails[i].code.split('.')[0]] == undefined) {
            ordersPackMap[orderDetails[i].code.split('.')[0]] = new Set();
        }
        ordersPackMap[orderDetails[i].code.split('.')[0]].add(orderDetails[i].code.split('.')[1]);
        let orderDetail = orderDetails[i];
        let product = await Product.findOne({ code: orderDetail.code });
        if (product) {
            newOrderDetails.push({ quantity: orderDetail.quantity, code: orderDetail.code });
            price += orderDetail.quantity * product.price;
            socksCount += orderDetail.quantity;
        } else {
            nonExistentCode = true;
            break;
        }
    }

    let discount = Math.abs(discountPercentage) > 100? 100 : Math.abs(discountPercentage);
    if (discountPercentage != 0) {
        price *= (1 - (discount / 100));
    } else if (socksCount >= 6) {
        price *= 0.8;
    } else if (socksCount >= 4) {
        price *= 0.85;
    } else if (Object.keys(ordersPackMap).length == 1 && ordersPackMap[Object.keys(ordersPackMap)[0]].size == 3)  {
        price *= 0.85;
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

async function updateProductOnOrderInsert(orderDetails) {
    for (let i = 0; i < orderDetails.length; i++) {
        let orderDetail = orderDetails[i];
        Product.findOneAndUpdate({ code: orderDetail.code }, { $inc: { 'availableToSell': (-1 * orderDetail.quantity) } }, { new: true }, function(err, product) {
            if (err) {
                return false;
            }
        });
    }
    return true;
}

async function updateProductOnOrderDelete(orderId) {
    return Order.findOne({ _id: orderId }, async function(err, order) {
        if (!err) {
            if (order) {
                for (let i = 0; i < order.orderDetails.length; i++) {
                    let orderDetail = order.orderDetails[i];
                    Product.findOneAndUpdate({ code: orderDetail.code }, { $inc: { 'availableToSell': orderDetail.quantity } }, { new: true }, function(err, product) {
                        if (err) {
                            return false;
                        }
                    });
                }
                return true;
            }
        } else {
            return false;
        }
    });
}

async function updateProductOnOrderEdit(orderDetails, preOrderDetails) {
    for (let i = 0; i < orderDetails.length; i++) {
        let orderDetail = orderDetails[i];
        let preOrderDetail = preOrderDetails[i];
        let update = orderDetail.quantity - preOrderDetail.quantity;
        Product.findOneAndUpdate({ code: orderDetail.code }, { $inc: { 'availableToSell': (-1 * update) } }, { new: true }, function(err, product) {
            if (err) {
                return false;
            }
        });
    }
    return true;
}


module.exports = {
    authenticateToken,
    getProductsIdsAndPrice,
    updateProductOnOrderInsert,
    updateProductOnOrderDelete,
    updateProductOnOrderEdit
}