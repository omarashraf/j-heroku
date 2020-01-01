const mongoose = require('mongoose');
const Joi = require('joi');


const orderDetailsSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        ref: 'Product'
    }
});

const orderSchema = mongoose.Schema({
    placingDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        default: ''
    },
    dispatchingDate: {
        type: Date,
        default: ''
    },
    status: {
        type: String,
        required: true,
        enum: ['done', 'pending', 'dispatched'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    orderDetails: {
        type: [orderDetailsSchema],
        required: true
    },
    customerId: {
        type: String,
        ref: 'User'
    }
});

// needs for inspection to see if it is going to be used or not and hence removed from front-end
// function formulateOrderNumber(placingDate) {
//     const dateSpliited = new Date(placingDate).toLocaleDateString().split('-');
//     const timeSpliited = new Date(placingDate).toLocaleTimeString().split(' ')[0].split(":");
//     let orderNumber = dateSpliited[1]  + dateSpliited[2] + "-" + dateSpliited[0] + "-" + timeSpliited[0] + timeSpliited[1] + timeSpliited[2];
//     console.log(orderNumber);
//     return orderNumber;
// }
    
function validateOrder(order) {
    const schema = {
        orderDetails: Joi.required(),
        customerId: Joi.string(),
        user: Joi.object(),
        status: Joi.string().valid('pending', 'done', 'dispatched'),
        orderId: Joi.string(),
        deliveryDate: Joi.string().allow('').optional(),
        dispatchingDate: Joi.string().allow('').optional(),
    }
    return Joi.validate(order, schema);
}

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
exports.validateOrder = validateOrder;