const jwt = require('jsonwebtoken');

const ServerError = require('../../../WebApp/Models/ServerError.js');

const options = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE
};

const generateTokenAsync = async (payload) => {

    try {
        const token = jwt.sign({
            userId: payload.UserId,
            userRole: payload.UserRole
        }, process.env.JWT_SECRET_KEY, options);
        return token;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la semnarea tokenului!", 500);
    }
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
    generateTokenAsync,
    verifyAndDecodeDataAsync
};