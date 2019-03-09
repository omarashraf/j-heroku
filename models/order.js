const mongoose = require('mongoose');
const Joi = require('joi');


const orderDetailsSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

const orderSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['done', 'pending'],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

function validateOrder(order) {
    const schema = {
        orderDetails: Joi.required(),
        customerId: Joi.string(),
        user: Joi.object()
    }
    // return Joi.validate(order, schema) && validateOrderDetails(order.orderDetails);
    return Joi.validate(order, schema);
}

function validateOrderDetails(orderDetails) {
    let orderDetailSchema = Joi.object.keys({
        quantity: Joi.number().required(),
        productId: Joi.required()
    });

    let orderDetailsSchema = Joi.array().items(orderDetailSchema);

    return Joi.validate(orderDetails, orderDetailsSchema)
}

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
exports.validateOrder = validateOrder;