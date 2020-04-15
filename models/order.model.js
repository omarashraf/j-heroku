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
    status: {
        type: String,
        required: true,
        enum: ['delivered', 'pending'],
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
    },
    discountPercentage: {
        type: String,
        default: '0'
    },
    surveySent: {
        type: Boolean,
        default: false
    },
    surveyResponse: {
        type: Boolean,
        default: false
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
        status: Joi.string().valid('pending', 'delivered'),
        orderId: Joi.string(),
        deliveryDate: Joi.string().allow('').optional(),
        discountPercentage: Joi.string().optional(),
        preOrderDetails: Joi.optional(),
        surveySent: Joi.optional(),
        surveyResponse: Joi.optional()
    }
    return Joi.validate(order, schema);
}

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
exports.validateOrder = validateOrder;