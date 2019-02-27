const mongoose = require('mongoose');
const dotenv = require("dotenv");
const env = dotenv.config();

mongoose.connect(`mongodb://${process.env['DATABASE_URL']}/test`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log("connected to db");
}, (err) => {
    console.log("ERR --> ", err);
});