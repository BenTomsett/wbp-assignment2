var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bookTestRouter = require('./routes/booktest');
var userRouter = require('./routes/user');

require('dotenv').config();

var app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));

app.use('/register', bookTestRouter);
app.use('/user', userRouter);

module.exports = app;
