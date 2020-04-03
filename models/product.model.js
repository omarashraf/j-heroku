const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[A-Z][0-9]\.[0-9]+$/.test(v);
            }
        }
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    availableToSell: {
        type: Number
    }
});

function validateProduct(product) {
    const schmea = {
        name: Joi.string(),
        code: Joi.string().required().regex(/^[A-Z][0-9]\.[0-9]+$/),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        availableToSell: Joi.number()
        // image: Joi.string().required(),
    }
    return Joi.validate(product, schmea)
}

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;
exports.validateProduct = validateProduct;
