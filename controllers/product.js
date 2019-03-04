var { Product, validate } = require('../models/product');

async function insertProduct(req, res) {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let product = await Product.findOne({ code: req.body.code });
    if (product) {
        return res.status(409).send('Product already exists')
    } else {
        // insert product in db
        product = new Product({
            name: req.body.name,
            code: req.body.code
        });
        await product.save();
        return res.status(200).send(product);
    }
}

module.exports = {
    insertProduct
}