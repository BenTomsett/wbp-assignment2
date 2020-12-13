const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bookTestRouter = require('./routes/register');
const fs = require('fs');
const crypto = require('crypto');
const userRouter = require('./routes/user');
const utils = require('./utils');

//CHECK TO SEE IF .env FILE EXISTS - this file should be included in the project uploaded to Blackboard, but just in case it's missing or deleted, regenerate it.
//This .env file is required to hash the JSON Web Tokens used for login authentications. Without it, login won't work, but all the "strictly required" functionality will work.
if(fs.existsSync(`.env`)){
    console.log("\x1b[32mFound a .env file in the project root.\x1b[0m\n");
}else{
    //Create .env file if it doesn't exist, along with a condescending message
    console.log("\x1b[31mWARN:\x1b[0m No .env file was found in the root directory of the app. A .env file will be created with a random secret key for JWT authentication. Don't modify this file, and ensure it stays with the project from now on,");
    fs.writeFile(`.env`, "TOKEN_SECRET=" + crypto.randomBytes(64).toString('hex'), (err) => {
        if(err){
            console.log("\x1b[31mCOULDN'T CREATE .env FILE - EXITING.\x1b[0m");
            process.exit(1);
        }else{
            console.log("\x1b[32m.env file created. The server will now exit, simply run it again and you should be good to go!\x1b[0m");
            process.exit(0);
        }
    });
}

require('dotenv').config();

//Create express server
const app = express();

//Misc app configurations
app.set('view engine', 'ejs'); //Use EJS templating engine
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public/')); //Serves static elements like stylesheets and images

//Redirects request with a trailing slash to an identical URL without one
//Express has a 'quirk' when using EJS and static files where adding a traliing slash can cause issues
app.use(function (req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        let query = req.url.slice(req.path.length)
        res.redirect(301, req.path.slice(0, -1) + query)
    } else {
        next()
    }
})

//Registers the routes for user creation and login
app.use('/register', bookTestRouter);
app.use('/user', userRouter);

//Serves the / index page
app.get('/', (req, res, next) =>{
    res.render('../templates/index', {
        authenticated: utils.verifyToken(req)
    });
});

//Serves the /about-covid page
app.get('/about-covid', (req, res, next) =>{
    res.render('../templates/about-covid', {
        authenticated: utils.verifyToken(req)
    });
});

//Serves the /about-nti page
app.get('/about-nti', (req, res, next) =>{
    res.render('../templates/about-nti', {
        authenticated: utils.verifyToken(req)
    });
});

module.exports = app;
