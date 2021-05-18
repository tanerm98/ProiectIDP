const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('SELECT id, username, role_id FROM users');
};

const addAsync = async (username, password) => {
    console.info(`Adding user ${username}`);
    DEFAULT_ROLE = 2
    const users = await queryAsync('INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING id, username, role_id', [username, password, DEFAULT_ROLE]);
    return users[0];
};

const getByUsernameWithRoleAsync = async (username) => {
    console.info(`Getting user with username ${username}`);
    
    const users = await queryAsync(`SELECT u.id, u.password, 
                                u.username, r.value as role,
                                r.id as role_id FROM users u 
                                JOIN roles r ON r.id = u.role_id
                                WHERE u.username = $1`, [username]);
    return users[0];
};

const updateUserRoleAsync = async (userId, roleId) => {
    console.info(`Updating user's ${userId} role`);

    await queryAsync(`UPDATE users SET role_id = $2 WHERE id = $1`, [userId, roleId]);
}
module.exports = {
    getAllAsync,
    addAsync,
    getByUsernameWithRoleAsync,
    updateUserRoleAsync
}