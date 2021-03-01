let jwt = require('jsonwebtoken');
let config = require('../config.json');

module.exports = {
    encrypt: function (user) {
        console.log('encrypt :', user)
        // console.log("Encryption: "/* , JSON.stringify(userId, userDesignation, employeeDetails, studentDetails, personalDetails) */);
        return 'JWT ' + jwt.sign(user, config.secretKey);
    },
    decrypt: function (userToken) {
        // console.log("Inside Decrypt Token: ", jwt.verify(userToken, config.secretKey));
        return jwt.verify(userToken, config.secretKey);
    }
};