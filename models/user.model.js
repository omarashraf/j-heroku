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
      required: true,
      validate: {
        validator: function(v) {
          return /^\+[0-9]{12,13}$/.test(v);
        }
      } 
  },
  address: {
      type: String,
      required: true
  },
  type: {
    type: String,
    enum: ['potential', 'important', 'friend', ''],
    default: ''
  }
});

function validateUser(user) {
    const schmea = {
        name: Joi.string().required(),
        instagramUsername: Joi.string().required(),
        email: Joi.string().required().trim().email({ minDomainAtoms: 2 }).lowercase({ force: true }).regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        phone: Joi.string().required().regex(/^\+[0-9]{12,13}$/),
        address: Joi.string().required(),
        userId: Joi.string(),
        type: Joi.optional()
    }
    return Joi.validate(user, schmea)
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validateUser = validateUser;