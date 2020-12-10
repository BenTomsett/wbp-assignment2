const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bookTestRouter = require('./routes/booktest');
const userRouter = require('./routes/user');
const utils = require('./utils');

require('dotenv').config();

const app = express();

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
