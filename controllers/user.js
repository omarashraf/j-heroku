var { User, validate } = require('../models/user');

async function insertUser(req, res) {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let user = await User.findOne({ instagramUsername: req.body.instagramUsername });
    if (user) {
        return res.status(409).send('User already exists')
    } else {
        // insert user in db
        user = new User({
            name: req.body.name,
            instagramUsername: req.body.instagramUsername,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });
        await user.save();
        return res.status(200).send(user);
    }
}

module.exports = {
    insertUser
}