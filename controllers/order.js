const { Order, validateOrder } = require('../models/order');
const { User, validateUser } = require('../models/user');
const { Product, validateProduct } = require('../models/product');

const mongoose = require('mongoose');

const userCtrl = require('./user');

function getAllOrders() {

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
                userId = user._id;
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
            customerId: mongoose.Types.ObjectId(userId),
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
            newOrderDetails.push({ quantity: orderDetail.quantity, productId: mongoose.Types.ObjectId(product._id) });
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
    getAllOrders,
    insertOrder
}