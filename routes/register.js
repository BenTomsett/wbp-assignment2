const express = require('express');
const fs = require('fs');
const utils = require('../utils');

const domain = "nti.tomsett.xyz";
const apiKey = "key-72f6d4fa4910a436a58e8689a2eaed38";
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain, host: "api.eu.mailgun.net"});

const registerRouter = express.Router();

registerRouter.get('/', (req, res, next) =>{
    if(utils.verifyToken(req)){
        res.redirect('/user');
    }else{
        res.render('../templates/register', {
            success: false,
        });
    }
});

registerRouter.post('/', (req, res, next) => {
    if(doesUserExist(req.body.username)){
        res.render('../templates/register', {
            message: "A booking with that username already exists. Please either <a href=\"/user/login\">log in</a> or choose a different username.",
            success: false,
        });
    }else if(!validatePostcode(req.body.postcode.toUpperCase())){
        res.render('../templates/register', {
            message: "Please enter a valid UK postcode.",
            success: false,
        });
    }else{
        let data = JSON.stringify(req.body);
        fs.writeFile(`bookings/${req.body.username}.json`, data, (err) => {
            if(err){
                res.render('../templates/register', {
                    message: "An unknown error occurred. Please check your internet connection and try again. If the issue persists, please contact the Norwich Testing Initiative for more help."
                });
                throw err;
            }else{
                sendEmail(req.body);
                res.render("../templates/register", {
                    success: true,
                });
            }
        });
    }
});

module.exports = registerRouter;

//Sanity check - makes sure that postcode is in correct format
//Regex pattern from https://gist.github.com/simonwhitaker/5748487
const POSTCODE_REGEX = /^(GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\d{1,4})$/;
function validatePostcode(postcode){
    return POSTCODE_REGEX.test(postcode);
}

function doesUserExist(username){
    return fs.existsSync(`bookings/${username}.json`);
}

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