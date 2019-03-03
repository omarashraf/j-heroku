const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  instagramUsername: {
    type: String,
    unique: true,
    required: true
  },
  email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validateEmail, 'Please fill a valid email address']
  },
  phone: {
      type: String,
      required: true
  },
  address: {
      type: String,
      required: true
  }
});

function validateUser(user) {
    const schmea = {
        name: Joi.string().required(),
        instagramUsername: Joi.string().required(),
        email: Joi.string().required().trim().email({ minDomainAtoms: 2 }).lowercase({ force: true }),
        phone: Joi.string().required(),
        address: Joi.string().required()
    }
    return Joi.validate(user, schmea)
}

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser;