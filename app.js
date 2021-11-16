const express = require('express');
const app = express();
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const pool = require("./dbPool.js");
const nodemailer = require("nodemailer");

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth:
    {
        user: process.env.EMAIL_CLIENT_USERNAME,
        pass: process.env.EMAIL_CLIENT_PASSWORD
    }
});

app.set("view engine", "ejs");
app.use(express.static("public"));

require("dotenv").config();

//models
const { user } = require('./controllers/index.js');
const { render } = require('ejs');

//parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//sync db
// models.sequelize.sync().then(function() {
//     console.log("database syncronization complete");
// }).catch(function(err) {
//     console.log(err);
// });

// middleware
const auth = require("./middleware/auth");
const e = require('connect-flash');

//api routes
require("./routes")(app);

//routes
app.get('/', async (req, res) => {
    res.render('index');
}); //index


app.get('/home', auth, async (req, res) => {
    res.render('home');
}); //home

app.get('/db', async (req, res) => {
    let rows = await executeSQL('select 1;', []);
    res.send(rows);
}); //database test

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    // get user input
    // at this point all user input should be validated by validateRegistration.js

    const { firstname, lastname, email, password } = req.body;

    // validate form data when making a server side request
    if (!formIsValid(req.body)) {
        res.send('Form entry is invalid!');
    }

    // check if the user is already registered
    // TO-DO: add password projection { password: 0 }
    user.findByEmail({
        email: email.toLowerCase()
    })
        .then(function (newUser) {
            if (newUser === null) {
                let encryptedPassword = bcrypt.hashSync(password, saltRounds);

                user.create({
                    email: email.toLowerCase(),
                    firstname: firstname,
                    lastname: lastname,
                    password: encryptedPassword
                })
                    .then(function (user) {
                        // create token
                        const token = jwt.sign(
                            { email: email.toLowerCase() },
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: "2h",
                            }
                        );
                        // for persisting the session
                        res.cookie(`token`,token);

                        // send registration email
                        let sub = "Welcome to Soberly!";
                        let message = `<p>You have been registered successfully!</p>`;
                        sendEmail(user.email, sub, message);
                        
                        // end registration
                        res.send({
                            message: 'User successfully registered!',
                            type: 'success'
                        });
                    })
                    .catch(error => res.send({ message: error, type: 'error' }));
            } else {
                res.send({ message: 'User with that email already exists!', type: 'error' });
            }
        })
        .catch(error => res.send({ message: error, type: 'error' }));
}); //register

app.post('/login', (req, res) => {
    // get user input
    const { email, password } = req.body;

    // validate form data when making a server side request
    if (!formIsValid(req.body)) {
        res.send('Form entry is invalid!');
    }

    // check if the user is already registered
    user.findByEmail({
        email: email.toLowerCase()
    })
        .then(function (currentUser) {
            if (currentUser === null) {
                res.send({ message: 'User with that email does not exist!', type: 'error' });
            } else {
                bcrypt.compare(password, currentUser.password, (err, result) => {
                    if(result === true) {
                        const token = jwt.sign(
                            { email: currentUser.email },
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: "2h",
                            }
                        );
                        res.cookie(`token`,token);
                        res.send({
                            message: 'User successfully logged in!',
                            type: 'success'
                        });
                    } else {
                        console.log('incorrect password');
                        res.send({ message: 'Incorrect password entered!', type: 'error' });
                    }
                });
            }
        })
        .catch(error => console.log(error));
}); //login

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.render('index');
}); //logout

app.get('/report', auth, (req, res) => {
    res.render('report');
}); //logout

app.get('/journal', (req, res) => {
    res.render('journal');
}); //logout

//functions
async function executeSQL(sql, params) {
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}

function formIsValid(body) {
    let isValid = true;

    for (r in body) {
        if (r.length == 0) {
            isValid = false;
        }
    }

    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(body.email)) {
        isValid = false;
    }

    return isValid;
}

function sendEmail(email, subject, messageHTML) {
    // send mail with defined transport object
    let mailOptions =
    {
        from: `"Soberly" <abeebe@csumb.edu>`, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: messageHTML
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Email confirmation sent to ${email}\nInfo: ${info.response}`);
        }
    });
}

//listen
app.listen(port, () => {
    console.log('server started');
});