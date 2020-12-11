const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bookTestRouter = require('./routes/register');
const userRouter = require('./routes/user');
const utils = require('./utils');
const wwwhisper = require('connect-wwwhisper');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(wwwhisper());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public/'));

app.use(function (req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        let query = req.url.slice(req.path.length)
        res.redirect(301, req.path.slice(0, -1) + query)
    } else {
        next()
    }
})

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
