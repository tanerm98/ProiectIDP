const {
    queryAsync
} = require('..');

const addAsyncLaunchData = async (app_bundle_id, device, launch_type, launch_duration, memory_usage) => {
    console.info(`Adding launch data in database async...`);

    const launch_datas = await queryAsync('INSERT INTO launch_data (app_bundle_id, device, launch_type, launch_duration, memory_usage) VALUES ($1, $2, $3, $4, $5) RETURNING *', [app_bundle_id, device, launch_type, launch_duration, memory_usage]);
    return launch_datas[0];
};

const addAsyncInstallData = async (app_bundle_id, app_size, install_launch, install_memory) => {
    console.info(`Adding install data in database async...`);

    const install_datas = await queryAsync('INSERT INTO install_data (app_bundle_id, app_size, install_launch, install_memory) VALUES ($1, $2, $3, $4) RETURNING *', [app_bundle_id, app_size, install_launch, install_memory]);
    return install_datas[0];
};

const getLaunchDuration = async (app_bundle_id, device, launch_type, limit) => {
    console.info(`Getting launch duration data from database async...`);

    command = "select today_date, avg(launch_duration) "
    command += "from launch_data "
    command += "where app_bundle_id='" + app_bundle_id + "' "
    command += "and launch_duration is not null "
    if (device != null) {
        command += "and device='" + device + "' "
    }
    if (launch_type != null) {
        command += "and launch_type='" + launch_type + "' "
    }
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const getLaunchMemory = async (app_bundle_id, device, launch_type, limit) => {
    console.info(`Getting launch memory usage data from database async...`);

    command = "select today_date, avg(memory_usage) "
    command += "from launch_data "
    command += "where app_bundle_id='" + app_bundle_id + "' "
    command += "and memory_usage is not null "
    if (device != null) {
        command += "and device='" + device + "' "
    }
    if (launch_type != null) {
        command += "and launch_type='" + launch_type + "' "
    }
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const getInstallDuration = async (app_bundle_id, limit) => {
    console.info(`Getting install launch duration data from database async...`);

    command = "select today_date, avg(install_launch) "
    command += "from install_data "
    command += "where app_bundle_id='" + app_bundle_id + "' "
    command += "and install_launch is not null "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const getInstallMemory = async (app_bundle_id, limit) => {
    console.info(`Getting install memory usage data from database async...`);

    command = "select today_date, avg(install_memory) "
    command += "from install_data "
    command += "where app_bundle_id='" + app_bundle_id + "' "
    command += "and install_memory is not null "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

const getAppSize = async (app_bundle_id, limit) => {
    console.info(`Getting install app size data from database async...`);

    command = "select today_date, avg(app_size) "
    command += "from install_data "
    command += "where app_bundle_id='" + app_bundle_id + "' "
    command += "and app_size is not null "
    command += "group by today_date "
    command += "order by today_date desc "
    if (limit != null) {
        command += "limit " + limit
    }

    return await queryAsync(command);
};

module.exports = {
    addAsyncLaunchData,
    addAsyncInstallData,
    getLaunchDuration,
    getLaunchMemory,
    getInstallDuration,
    getInstallMemory,
    getAppSize
}