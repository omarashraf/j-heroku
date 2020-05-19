const nodemailer = require('nodemailer');
const _jade = require('jade');
const fs = require('fs');
const { Product } = require('../models/product.model');
const { User } = require('../models/user.model');
const { validateEmailBody } = require('../models/email-body.model');
// const xoauth2 = require("xoauth2");

async function sendEmail(req, res) {
    const { error } = validateEmailBody(req.body);
    if (error) {
        return res.status(400).send({
            msg: error['details'][0]['message']
        });
    }
    
    // get all names for orderdetails
    let orderDetails = [];
    let totalCount = 0;
    for (let i = 0; i < req.body.orderDetails.length; i++) {
        const product = await Product.findOne({ code:  req.body.orderDetails[i].code });
        if (!product) {
            return res.status(404).send({
                msg: 'product name not found'
            });
        }
        totalCount += req.body.orderDetails[i].quantity;
        orderDetails.push({ code: req.body.orderDetails[i].code, quantity: req.body.orderDetails[i].quantity, name: product.name });
    }

    // get name and email of supplied username
    const user = await User.findOne({ instagramUsername: req.body.username });
    if (!user) {
        return res.status(404).send({
            msg: 'user\'s name not found'
        });
    }

    var template = process.cwd() + '/templates/jawareb_receipt_template.jade';
    fs.readFile(template, 'utf8', function(err, file) {
        if(err) {
            return res.status(500).send({
                msg: err
            });
        } else {
            var compiledTmpl = _jade.compile(file, {filename: template});
            var context = { 
                price: req.body.price,
                deliveryFees: req.body.deliveryFees,
                orderDetails,
                totalCount,
                name: user.name
            };
            var html = compiledTmpl(context);
            
            sendMail(user.email, 'Jawareb Receipt', html, function(err, response){
                if(err) {
                    return res.status(500).send({
                        msg: err
                    });
                }
            });
        }
    });
    res.send('OK');
}

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        // TODO: using xoauth2
        // xoauth2: xoauth2.createXOAuth2Generator({
            user: process.env.EMAIL,
            pass: process.env.PASS
        // })
    }
});

var sendMail = function(toAddress, subject, content, next){
    var mailOptions = {
      from: "Jawareb <" + process.env.EMAIL + ">",
      to: toAddress,
      replyTo: process.env.EMAIL,
      subject: subject,
      html: content
      //   cc: process.env.EMAIL,
    };

    smtpTransport.sendMail(mailOptions, next);
}; 

module.exports = {
    sendEmail
}