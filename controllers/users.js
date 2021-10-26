const Users = require('../models').Users;

module.exports = {
    create(req, res) {
        console.log(req.body);
        return Users
            .create({
                email: req.body.email,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error));
    },
};