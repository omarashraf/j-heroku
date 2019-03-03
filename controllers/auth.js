const Joi = require('joi');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const env = dotenv.config();
const jwt = require('jsonwebtoken');

const { Admin } = require('../models/admin');

async function authAdmin(req, res) {

    // validate the body of the request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    //  find the admin by username
    let admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
        return res.status(400).send('Incorrect username.');
    }
 
    // validate credentials by comparing hashes of passwords
    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect password.');
    }
 
    const token = jwt.sign({ _id: admin._id }, env.parsed['PRIVATE_KEY'], {
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