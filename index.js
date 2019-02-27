var express = require('express');
var app = express();
var cors = require('cors');

var dbConfig = require('./db/config');

app.use(cors());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});