require("dotenv").config();

var config_vars =
    {
        "development": {
            "username": process.env.DB_SERVER_USER,
            "password": process.env.DB_SERVER_PASSWORD,
            "database": process.env.DB_SERVER_DATABASE,
            "host": process.env.DB_SERVER_HOST,
            "dialect": "mysql"
          },
          "test": {
            "username": process.env.DB_SERVER_USER,
            "password": process.env.DB_SERVER_PASSWORD,
            "database": process.env.DB_SERVER_DATABASE,
            "host": process.env.DB_SERVER_HOST,
            "dialect": "mysql"
          },
          "production": {
            "username": process.env.DB_SERVER_USER,
            "password": process.env.DB_SERVER_PASSWORD,
            "database": process.env.DB_SERVER_DATABASE,
            "host": process.env.DB_SERVER_HOST,
            "dialect": "mysql"
          }
    };

module.exports = config_vars;