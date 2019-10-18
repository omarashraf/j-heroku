const dotenv = require('dotenv');
const env = dotenv.config();
const jwt = require('jsonwebtoken');
const { Product } = require('../models/product.model');


function authenticateToken(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, env.parsed['PRIVATE_KEY'], function(err, decoded) {
            if (err) {
                return res.status(400).send({
                    msg: 'failed to authenticate token'
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

module.exports = {
    authenticateToken,
    getProductsIdsAndPrice
}