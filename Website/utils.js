const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');

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

function verifyToken(req){
    let authenticated = false;
    const token = req.cookies['token'];
    if(token == null){
        return authenticated;
    }else{
        console.log("Token not null, verifying");
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            console.log("JWT Error: " + err);
            if(!err){
                console.log("Returning true");
                authenticated = true;
            }
        });
    }
    return authenticated;
}

function authenticateMiddleware(req, res, next){
    const token = req.cookies['token'];
    if(token == null){
        return res.redirect('/user/login');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log("JWT Error: " + err);
        if (err){
            return res.redirect('/user/login');
        } else{
            req.user = user;
            next();
        }
    })
}

module.exports = {
    doesUserExist: doesUserExist,
    isCorrectPassword: isCorrectPassword,
    loadUserData: loadUserData,
    generateAuthToken: generateAuthToken,
    verifyToken: verifyToken,
    authenticateMiddleware: authenticateMiddleware,
};