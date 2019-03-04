const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const dbConfig = require('./db/config');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});