const Users = require('../models').Users;

module.exports = {
    create(data) {
        return Users
            .create({
                email: data.email,
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname
            })
            .then(function(user) {
                console.log(user.email + ' sucessfully added to the database.');
                return user;
            })
            .catch(error => console.log(error));
    },
    updateToken(data) {
        return Users
            .update(
                { token: data.token },
                { where: {email: data.email} }
            )
            .then(function() {
                console.log('token updated successfully for user.');
            })
            .catch(error => console.log(error));
    },
    findByEmail(data) {
        return Users
            .findOne({
                where: { email: data.email }
            })
            .then(function(user) { return user; })
            .catch(error => console.log(error));
    }
};