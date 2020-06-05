var { User, validateUser } = require('../models/user.model');
const { Order } = require('../models/order.model');

async function insertUser(req, res) {
    const { error } = validateUser(req.body);
    if (error) {
        console.log(error);
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
            address: req.body.address,
            type: req.body.type
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
                userId: user._id,
                email: user.email,
                name: user.name,
                address: user.address,
                phone: user.phone
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

async function getAllUsers(req, res) {
    if (req.query.meta === 'true') {
        let count = await User.countDocuments();
        if (count) {
            res.status(200).send({
                msg: 'users count fetched successfully',
                count
            });
        } else {
            res.status(500).send({
                msg: 'could not fetch counter',
            });
        }
    } else {
        let users = await User.find();
        if (users && users.length > 0) {
            res.status(200).send({
                msg: 'users fetched successfully',
                users
            });
        } else {
            res.status(200).send({
                msg: 'there are no users to be fetched',
                users
            });
        }
    }
}

function deleteUser(req, res) {
    let userId = req.params.id;
    if (userId) {
        Order.findOne({ customerId: userId }, function(err, order) {
            if(!order) {
                User.findOneAndRemove({ instagramUsername: userId }, function(err) {
                    if (err) {
                        res.status(500).send({
                            msg: err.message
                        });
                    } else {
                        res.status(200).send({
                            msg: 'user deleted successfully',
                            userId
                        })
                    }
                });
            } else {
                res.status(403).send({
                    msg: 'There is one or more order associated to that user'
                });
            }
        });
    } else {
        res.status(400).send({
            msg: 'no user id is supplied'
        });
    }
}

function editUser(req, res) {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        instagramUsername: req.body.instagramUsername,
        phone: req.body.phone,
        address: req.body.address,
        type: req.body.type
    }

    User.findOneAndUpdate({ _id: req.body.userId }, newUser, { new: true }, function(err, user) {
        if (!err) {
            res.status(200).send({
                msg: 'user updated successfully',
                user
            })
        } else {
            res.status(404).send({
                msg: 'no such user with the supplied id'
            });
        }
    });

}

module.exports = {
    insertUser,
    getUser,
    getAllUsers,
    deleteUser,
    editUser
}