const mongoose = require('mongoose');
const dotenv = require("dotenv");
const env = dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DATABASE_URL}`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log("connected to db");
}, (err) => {
    console.log("ERR --> ", err);
});