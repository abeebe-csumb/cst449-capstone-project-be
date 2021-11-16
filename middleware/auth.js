// middleware
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const config = process.env;

const verifyToken = (req, res, next) => {
    var cookie;
    try {
        cookie = req.headers.cookie.split("=")[1];
    } catch (e) {
        console.log("no cookie for you.");
    }
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || cookie;

    if (!token) {
        // return res.status(403).send("A token is required for authentication");
        return res.render("index");
    } try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = verifyToken;