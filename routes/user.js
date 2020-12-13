const express = require('express');
const utils = require('../utils');

const userRouter = express.Router();

//Serves the /user page, uses middleware that only serves the page if the request has a valid JWT authentication cookie
userRouter.get('/', utils.authenticateMiddleware, (req, res, next) =>{
    //Checks that the user does actually exist (token can be perfectly valid, but the username that is hashed might not exist)
    if(utils.doesUserExist(req.user.username)){
        const user = utils.loadUserData(req.user.username);
        //Renders the user page with the user's data
        res.render('../templates/user', {
            authenticated: utils.verifyToken(req),
            user: user,
        });
    //Not authenticated, redirect to login page
    }else{
        res.redirect('/user/login');
    }
})

//Servers the /user/login page
userRouter.get('/login', (req, res, next) =>{
    //If logged in, go to user page
    if(utils.verifyToken(req)){
        res.redirect('/user');
    //Render login page
    }else{
        res.render('../templates/login');
    }
});

//Handles login form submission
userRouter.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    //If username and password are correct
    if(utils.doesUserExist(username) && utils.isCorrectPassword(username, password)){
        //Generates and attaches a JWT to a cookie and sends it back with the request to redirect to the user page
        const authToken = utils.generateAuthToken(username);
        res.cookie('token', authToken);
        res.redirect('/user');
    //Invalid details, returns error message
    }else{
        res.render('../templates/login', {
            message: "Invalid username or password."
        })
    }

});

module.exports = userRouter;