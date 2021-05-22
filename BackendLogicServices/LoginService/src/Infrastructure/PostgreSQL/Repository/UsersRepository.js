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

const updateRegisteredUsersMetric = async () => {
    console.info(`Updating registered users metric`);
    const metrics = await queryAsync('SELECT * FROM user_metrics WHERE today_date=CURRENT_DATE');

    if (metrics.length == 0) {
        await queryAsync('INSERT INTO user_metrics (registers) VALUES (1)');
    } else {
        const registers = metrics[0].registers;
        await queryAsync('UPDATE user_metrics SET registers=$1 WHERE today_date=CURRENT_DATE', [registers+1]);
    }

}

const updateLoggedInUsersMetric = async () => {
    console.info(`Updating registered users metric`);
    const metrics = await queryAsync('SELECT * FROM user_metrics WHERE today_date=CURRENT_DATE');

    if (metrics.length == 0) {
        await queryAsync('INSERT INTO user_metrics (logins) VALUES (1)');
    } else {
        const logins = metrics[0].logins;
        await queryAsync('UPDATE user_metrics SET logins=$1 WHERE today_date=CURRENT_DATE', [logins+1]);
    }

}

module.exports = {
    getAllAsync,
    addAsync,
    getByUsernameWithRoleAsync,
    updateUserRoleAsync,
    updateRegisteredUsersMetric,
    updateLoggedInUsersMetric
}