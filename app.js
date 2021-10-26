const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));

require("dotenv").config();
const bodyParser = require('body-parser');

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//models
var models = require("./models");

//sync db
models.sequelize.sync().then(function() {
    console.log("database syncronization complete");
}).catch(function(err) {
    console.log(err);
});

//api routes
require("./routes")(app);

//routes
app.get('/', async (req, res) => {
    res.render('index')
}); //index

app.get('/db', async (req, res) => {
    let rows = await executeSQL('select 1;', []);
    res.send(rows);
}); //database test

//functions
async function executeSQL(sql, params) {
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}

//listen
app.listen(port, () => {
    console.log('server started');
});