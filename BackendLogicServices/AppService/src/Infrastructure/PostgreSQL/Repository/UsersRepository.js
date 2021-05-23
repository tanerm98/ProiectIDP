const {
    queryAsync
} = require('..');

const getUserRegisters = async (limit) => {
    console.info(`Getting user registers data from database async...`);

    command = "select today_date, sum(registers) "
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

    command = "select today_date, sum(logins) "
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

    command = "select today_date, sum(jobs) "
    command += "from user_metrics "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const updateJobsRunUsersMetric = async () => {
    console.info(`Updating registered users metric`);
    const metrics = await queryAsync('SELECT * FROM user_metrics WHERE today_date=CURRENT_DATE');

    if (metrics.length == 0) {
        await queryAsync('INSERT INTO user_metrics (jobs) VALUES (1)');
    } else {
        const jobs = metrics[0].jobs;
        await queryAsync('UPDATE user_metrics SET jobs=$1 WHERE today_date=CURRENT_DATE', [jobs+1]);
    }

}

module.exports = {
    getUserRegisters,
    getUserLogin,
    getRunJobs,
    updateJobsRunUsersMetric
}