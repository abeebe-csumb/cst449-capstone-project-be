const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get('/', async (req, res) => {
    let rows = await executeSQL('select 1;', []);
    res.send(rows);
}); //test

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