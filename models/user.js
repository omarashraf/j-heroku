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
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        }
      }
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

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser;