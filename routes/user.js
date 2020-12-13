const express = require('express');
const utils = require('../utils');

const userRouter = express.Router();

userRouter.get('/', utils.authenticateMiddleware, (req, res, next) =>{
    if(utils.doesUserExist(req.user.username)){
        const user = utils.loadUserData(req.user.username);
        res.render('../templates/user', {
            authenticated: utils.verifyToken(req),
            user: user,
        });
    }else{
        res.redirect('/user/login');
    }
})

userRouter.get('/login', (req, res, next) =>{
    if(utils.verifyToken(req)){
        res.redirect('/user');
    }else{
        res.render('../templates/login');
    }
});

userRouter.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if(utils.doesUserExist(username) && utils.isCorrectPassword(username, password)){
        const authToken = utils.generateAuthToken(username);
        res.cookie('token', authToken);
        res.redirect('/user');
    }else{
        res.render('../templates/login', {
            message: "Invalid username or password."
        })
    }

});

module.exports = userRouter;