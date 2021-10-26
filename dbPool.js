const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: process.env.DB_SERVER_CONNECTION_LIMIT,
    host: process.env.DB_SERVER_HOST,
    user: process.env.DB_SERVER_USER,
    password: process.env.DB_SERVER_PASSWORD,
    database: process.env.DB_SERVER_DATABASE
});

module.exports = pool;