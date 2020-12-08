var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bookTestRouter = require('./routes/booktest');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));

app.use('/register', bookTestRouter);

module.exports = app;
