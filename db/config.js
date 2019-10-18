const mongoose = require('mongoose');
const dotenv = require("dotenv");
const env = dotenv.config();

mongoose.connect(`mongodb://${env.process.USER}:${env.process.PASSWORD}@${env.process.DATABASE_URL}`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log("connected to db");
}, (err) => {
    console.log("ERR --> ", err);
});