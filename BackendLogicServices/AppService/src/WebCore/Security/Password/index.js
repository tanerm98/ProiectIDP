const bcryptjs = require('bcryptjs');

// va trebui sa folositi compare atunci cand primiti cerere de autentificare
const comparePlainTextToHashedPasswordAsync = async (plainTextPassword, hashedPassword) => {

    console.info('Comparing plaintext to hashed password');
    return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

module.exports = {
    comparePlainTextToHashedPasswordAsync
}