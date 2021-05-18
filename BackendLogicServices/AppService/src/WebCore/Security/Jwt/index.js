const jwt = require('jsonwebtoken');

const ServerError = require('../../../WebApp/Models/ServerError.js');

const options = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE
};

const verifyAndDecodeDataAsync = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, options);
        return decoded;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la decriptarea tokenului!", 401);
    }
};

module.exports = {
    verifyAndDecodeDataAsync
};