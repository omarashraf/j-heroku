const Joi = require('joi');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const env = dotenv.config();
const jwt = require('jsonwebtoken');

const { Admin } = require('../models/admin.model');

async function authAdmin(req, res) {

    // validate the body of the request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    //  find the admin by username
    let admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
        return res.status(400).send({
            msg: 'Incorrect username'
        });
    }
 
    // validate credentials by comparing hashes of passwords
    // const validPassword = await 
    bcrypt.compare(req.body.password, admin.password, function(err, result) {
        if (!result || err) {
            return res.status(400).send({
                msg: 'Incorrect password'
            });
        }
    });
 
    const token = jwt.sign({ _id: admin._id }, process.env.PRIVATE_KEY, {
        expiresIn: 60*60*24
    });
    res.send(token);
}

function validate(admin) {
    const schema = {
        username: Joi.string().min(5).required(),
        password: Joi.string().min(8).required()
    };
 
    return Joi.validate(admin, schema);
}

module.exports = {
    authAdmin
}