const express = require('express');
const utils = require('../utils');

const userRouter = express.Router();

userRouter.get('/', utils.authenticateMiddleware, (req, res, next) =>{
    const user = utils.loadUserData(req.user.username);
    res.render('../templates/user', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        ethnicity: user.ethnicity,
        house_name: user.house_name,
        postcode: user.postcode,
        username: user.username,
        testDateOne: user.testDateOne,
        testTimeOne: user.testTimeOne,
        testDateTwo: user.testDateTwo,
        testTimeTwo: user.testTimeTwo,
    });
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