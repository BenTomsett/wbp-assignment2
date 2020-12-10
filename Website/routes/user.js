const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

userRouter.get('/', verifyToken, (req, res, next) =>{
    const user = loadUserData(req.user.username);
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
    if(req.cookies['token'] != null){
        res.redirect('/user');
    }else{
        res.render('../templates/login');
    }
});

userRouter.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if(doesUserExist(username) && isCorrectPassword(username, password)){
        const authToken = generateAuthToken(username);
        res.cookie('token', authToken);
        res.redirect('/user');
    }else{
        res.render('../templates/login', {
            message: "Invalid username or password."
        })
    }

});

module.exports = userRouter;

function doesUserExist(username){
    return fs.existsSync(`bookings/${username}.json`);
}

function isCorrectPassword(username, password){
    let user = JSON.parse(fs.readFileSync(`bookings/${username}.json`).toString());
    return user.password === password;
}

function loadUserData(username){
    return JSON.parse(fs.readFileSync(`bookings/${username}.json`).toString());
}

function generateAuthToken(username){
    return jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: '30m' });
}

function verifyToken(req, res, next){
    console.log(req.cookies);
    const token = req.cookies['token'];
    if(token == null){
        return res.redirect('/user/login');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err){
            return res.sendStatus(403);
        } else{
            req.user = user;
            next();
        }
    })
}