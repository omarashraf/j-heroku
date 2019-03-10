var { User, validate } = require('../models/user');

async function insertUser(req, res) {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let user = await User.findOne({ $or: [{instagramUsername: req.body.instagramUsername}, {email: req.body.email}] });
    if (user) {
        return res.status(409).send({
            msg: "user already exists",
            user
        });
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
        return res.status(200).send({
            msg: "user inserted successfully",
            user
        });
    }
}

async function getUser(req, res) {
    const userId = req.params.id;
    if (userId) {
        let user = await User.findOne({ instagramUsername: userId });
        if (user) {
            res.status(200).send({
                msg: 'user id fetched successfully',
                userId: user._id
            });
        } else {
            res.status(404).send({
                msg: 'user not found'
            });
        }
    } else {
        res.status(400).send({
            msg: 'no user id is supplied'
        });
    }
}

module.exports = {
    insertUser,
    getUser
}