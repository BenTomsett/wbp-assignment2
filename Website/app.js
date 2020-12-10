const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bookTestRouter = require('./routes/register');
const userRouter = require('./routes/user');
const utils = require('./utils');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use('/register', bookTestRouter);
app.use('/user', userRouter);

app.get('/', (req, res, next) =>{
    res.render('../templates/index', {
        authenticated: utils.verifyToken(req)
    });
});

app.get('/about-covid', (req, res, next) =>{
    res.render('../templates/about-covid', {
        authenticated: utils.verifyToken(req)
    });
});

app.get('/about-nti', (req, res, next) =>{
    res.render('../templates/about-nti', {
        authenticated: utils.verifyToken(req)
    });
});

module.exports = app;
