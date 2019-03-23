const dotenv = require('dotenv');
const env = dotenv.config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, env.parsed['PRIVATE_KEY'], function(err, decoded) {
            if (err) {
                return res.status(400).send({
                    msg: 'failed to authenticate token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).send({
            msg: 'No token provided'
        });
    }
}

module.exports = {
    authenticateToken
}