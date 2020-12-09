const express = require('express');
const fs = require('fs');

const domain = "nti.tomsett.xyz";
const apiKey = "c6d16286d47f8a432e7b4b6134bca509-7bce17e5-43325f03";
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain, host: "api.eu.mailgun.net"});

const bookTestRouter = express.Router();

bookTestRouter.post('/booktest', (req, res, next) => {
    if(doesBookingExist(req.body.username)){
        res.status(400).send("ERR_USERNAME_EXISTS");
    }else if(!validatePostcode(req.body.postcode.toUpperCase())){
        res.status(400).send("ERR_INVALID_POSTCODE");
    }else{
        let data = JSON.stringify(req.body);
        fs.writeFile(`bookings/${req.body.username}.json`, data, (err) => {
            if(err){
                res.status(500).send();
                throw err;
            }else{
                sendEmail(req.body);
                res.status(200).send();
            }
        });
    }
});

module.exports = bookTestRouter;

//Sanity check - makes sure that postcode is in correct format
//Regex pattern from https://gist.github.com/simonwhitaker/5748487
const POSTCODE_REGEX = /^(GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\d{1,4})$/;
function validatePostcode(postcode){
    return POSTCODE_REGEX.test(postcode);
}

function doesBookingExist(username){
    return fs.existsSync(`bookings/${username}.json`);
}

function sendEmail(body){

    const data = {
        from: 'Norwich Testing Initiative <nti@nti.tomsett.xyz>',
        to: "ben.e.tomsett@gmail.com",
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