let tokens = require('./tokens');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    } else {
        if ((authHeader = req.headers.authorization) && req.headers.authorization.includes('JWT ')) {
            const token = authHeader.split('JWT ')[1];
            let userObject = tokens.decrypt(token);
            req.user = userObject;
            next();
        } else {
            res.status(401).json({
                error: "Authorization Failed",
                errorCode: "NOT_AUTHORIZED"
            });
        }
    }
};