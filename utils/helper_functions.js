const dotenv = require('dotenv');
const env = dotenv.config();
const jwt = require('jsonwebtoken');
const { Product } = require('../models/product.model');


function authenticateToken(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded) {
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

    if (socksCount >= 6) {
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

module.exports = {
    authenticateToken,
    getProductsIdsAndPrice
}