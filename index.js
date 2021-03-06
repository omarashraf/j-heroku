const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const env = dotenv.config();
const path = require('path');

const dbConfig = require('./db/config');

const adminRoutes = require('./routes/admin.route');
const authRoutes = require('./routes/auth.route');
const orderRoutes = require('./routes/order.route');
const productRoutes = require('./routes/product.route');
const userRoutes = require('./routes/user.route');
const emailRoutes = require('./routes/email.route');

app.use(cors());
app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/email', emailRoutes);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(__dirname + '/images'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 3001, function () {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});