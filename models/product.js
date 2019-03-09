const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number,
        required: true
    }
});

function validateProduct(product) {
    const schmea = {
        name: Joi.string(),
        code: Joi.string().required(),
        price: Joi.number().required()
        // image: Joi.string().required(),
    }
    return Joi.validate(product, schmea)
}

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;
exports.validateProduct = validateProduct;
