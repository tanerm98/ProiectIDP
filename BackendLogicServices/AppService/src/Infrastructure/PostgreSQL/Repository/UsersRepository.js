const {
    queryAsync
} = require('..');

const getUserRegisters = async (limit) => {
    console.info(`Getting user registers data from database async...`);

    command = "select today_date, avg(registers) "
    command += "from user_metrics "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const getUserLogin = async (limit) => {
    console.info(`Getting user logins data from database async...`);

    command = "select today_date, avg(logins) "
    command += "from user_metrics "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const getRunJobs = async (limit) => {
    console.info(`Getting jobs run data from database async...`);

    command = "select today_date, avg(jobs) "
    command += "from user_metrics "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

module.exports = {
    getUserRegisters,
    getUserLogin,
    getRunJobs
}