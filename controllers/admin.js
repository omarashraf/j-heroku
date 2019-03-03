const bcrypt = require('bcrypt');
const saltRounds = 10;
var { Admin, validate } = require('../models/admin');

async function insertAdmin(req, res) {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let admin = await Admin.findOne({ username: req.body.username });
    if (admin) {
        return res.status(409).send('Admin already exists')
    } else {
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            // insert admin in db
            admin = new Admin({
                name: req.body.name,
                username: req.body.username,
                password: hash
            });
            await admin.save();
            return res.status(200).send(admin);
        });
    }
}

module.exports = {
    insertAdmin
}