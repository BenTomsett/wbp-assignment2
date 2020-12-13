const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');

//Checks to see if a given username exists
function doesUserExist(username){
    return fs.existsSync(`bookings/${username}.json`);
}

//Checks to see if a given password is the correct password for that username
function isCorrectPassword(username, password){
    let user = JSON.parse(fs.readFileSync(`bookings/${username}.json`).toString());
    return user.password === password;
}

//Loads the JSON file containing the user's data
function loadUserData(username){
    return JSON.parse(fs.readFileSync(`bookings/${username}.json`).toString());
}

//Generates a JSON web token by hashing the username with the 64-bit secret key in .env - sets the keys to expire after thirty  minutes
function generateAuthToken(username){
    return jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: '30m' });
}

//Checks whether a token if valid -- note doesn't check to see if the user also exists (see /routes/user)
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
                if(doesUserExist(user.username)){
                    console.log("Returning true");
                    authenticated = true;
                }
            }
        });
    }
    return authenticated;
}

//Authentication middleware, only allows the user to continue where this is used if they're logged in
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

//Sanity check - makes sure that postcode is in correct format
//Regex pattern from https://gist.github.com/simonwhitaker/5748487
const POSTCODE_REGEX = /^(GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\d{1,4})$/;
function validatePostcode(postcode){
    return POSTCODE_REGEX.test(postcode);
}

module.exports = {
    doesUserExist: doesUserExist,
    isCorrectPassword: isCorrectPassword,
    loadUserData: loadUserData,
    generateAuthToken: generateAuthToken,
    verifyToken: verifyToken,
    authenticateMiddleware: authenticateMiddleware,
    validatePostcode: validatePostcode,
};