const express = require('express');
const fs = require('fs');
const utils = require('../utils');

const domain = "nti.tomsett.xyz";
const apiKey = "key-72f6d4fa4910a436a58e8689a2eaed38";
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain, host: "api.eu.mailgun.net"});

const registerRouter = express.Router();

//Serves /register page
registerRouter.get('/', (req, res, next) =>{
    //if logged in, redirect to user page (can't sign up more than once)
    if(utils.verifyToken(req)){
        res.redirect('/user');
    }else{
        res.render('../templates/register', {
            success: false,
        });
    }
});

//Handles form submission
registerRouter.post('/', (req, res, next) => {
    //Check that user doesn't already exist
    if(utils.doesUserExist(req.body.username)){
        res.render('../templates/register', {
            message: "A booking with that username already exists. Please either <a href=\"/user/login\">log in</a> or choose a different username.",
            success: false,
        });
    //Checks that the supplied postcode is valid
    }else if(!utils.validatePostcode(req.body.postcode.toUpperCase())){
        res.render('../templates/register', {
            message: "Please enter a valid UK postcode.",
            success: false,
        });
    //Valid data, create user
    }else{
        //Attempts to create .json file with booking info
        let data = JSON.stringify(req.body);
        fs.writeFile(`bookings/${req.body.username}.json`, data, (err) => {
            if(err){
                //Renders registration page with an unknown error
                res.render('../templates/register', {
                    message: "An unknown error occurred. Please check your internet connection and try again. If the issue persists, please contact the Norwich Testing Initiative for more help."
                });
                throw err;
            }else{
                //File created, send success email and redirect to success page
                sendEmail(req.body);
                res.render("../templates/register", {
                    success: true,
                });
            }
        });
    }
});

module.exports = registerRouter;


//Sends confirmation email using Mailgun API
function sendEmail(body){
    const data = {
        from: 'Norwich Testing Initiative <nti@nti.tomsett.xyz>',
        to: body.email,
        subject: "Booking confirmation - Norwich Testing Initaitive",
        template: "booking",
        'v:firstname': body.first_name,
        'v:lastname': body.last_name,
        "v:firstdate": body.testDateOne,
        "v:firsttime": body.testTimeOne,
        "v:seconddate": body.testDateTwo,
        "v:secondtime": body.testTimeTwo
    }
    mailgun.messages().send(data, function(error, body){
        console.log(error);
        console.log(body);
    });

}