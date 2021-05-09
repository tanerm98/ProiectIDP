const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding role in database`);

    const roles = await queryAsync('INSERT INTO roles (value) VALUES ($1) RETURNING *', [value]);

    return roles[0];
};

const getAllAsync = async() => {
    console.info(`Getting all roles from database`);

    return await queryAsync('SELECT * FROM roles');
};

module.exports = {
    addAsync,
    getAllAsync
}