const bcryptjs = require('bcryptjs');

// va trebui sa folositi hash atunci cand stocati parola in baza de date, la register
const hashPasswordAsync = async (plainTextPassword) => {

    console.info('Hashing password');

    const salt = await bcryptjs.genSalt();
    return await bcryptjs.hash(plainTextPassword, salt);
};

// va trebui sa folositi compare atunci cand primiti cerere de autentificare
const comparePlainTextToHashedPasswordAsync = async (plainTextPassword, hashedPassword) => {

    console.info('Comparing plaintext to hashed password');
    return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

module.exports = {
    hashPasswordAsync,
    comparePlainTextToHashedPasswordAsync
}