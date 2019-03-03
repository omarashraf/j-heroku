const mongoose = require('mongoose');
const Joi = require('joi');

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
      type: String,
      required: true
  }
});

function validateAdmin(admin) {
    const schmea = {
        name: Joi.string().required(),
        password: Joi.string().required(),
        username: Joi.string().required(),
    }
    return Joi.validate(admin, schmea)
}

const Admin = mongoose.model('Admin', adminSchema);

exports.Admin = Admin;
exports.validate = validateAdmin;