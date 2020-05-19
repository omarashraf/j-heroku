const Joi = require('joi');

function validateEmailBody(emailBody) {
    const schmea = {
        username: Joi.string().required(),
        orderDetails: Joi.required(),
        price: Joi.number().required(),
        deliveryFees: Joi.number().required(),
    }
    return Joi.validate(emailBody, schmea)
}

exports.validateEmailBody = validateEmailBody;
