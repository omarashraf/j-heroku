const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['done', 'pending']
    },
    price: {
        type: Number,
        required: true
    },
    orderDetails: {
        type: [orderDetailsSchema],
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const orderDetailsSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

function validateOrder(order) {
    const schema = {
        name: Joi.string().required().valid('done', 'pending'),
        price: Joi.number().required(),
        orderDetails: Joi.required(),
        customer: Joi.required()
    }
    return Joi.validate(order, schema) && validateOrderDetails(order.orderDetails);
}

function validateOrderDetails(orderDetails) {
    let orderDetailSchema = Joi.object.keys({
        quantity: Joi.number().required(),
        product: Joi.required()
    });

    let orderDetailsSchema = Joi.array().items(orderDetailSchema);

    return Joi.validate(orderDetails, orderDetailsSchema)
}

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
exports.validateOrder = validateOrder;