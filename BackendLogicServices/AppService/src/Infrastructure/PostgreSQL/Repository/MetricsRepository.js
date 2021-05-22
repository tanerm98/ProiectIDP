const {
    queryAsync
} = require('..');

const addAsyncLaunchData = async (app_bundle_id, device, launch_type, launch_duration, memory_usage) => {
    console.info(`Adding launch data in database async...`);

    const launch_datas = await queryAsync('INSERT INTO launch_data (app_bundle_id, device, launch_type, launch_duration, memory_usage) VALUES ($1, $2, $3, $4, $5) RETURNING *', [app_bundle_id, device, launch_type, launch_duration, memory_usage]);
    return launch_datas[0];
};

const addAsyncInstallData = async (app_bundle_id, app_size, install_launch, install_memory) => {
    console.info(`Adding install data data in database async...`);

    const install_datas = await queryAsync('INSERT INTO install_data (app_bundle_id, app_size, install_launch, install_memory) VALUES ($1, $2, $3, $4) RETURNING *', [app_bundle_id, app_size, install_launch, install_memory]);
    return install_datas[0];
};

//const getAllAsync = async () => {
//    console.info(`Getting all workspaces from database async...`);
//
//    return await queryAsync('SELECT * FROM workspaces');
//};
//
//const getByIdAsync = async (app_bundle_id) => {
//    console.info(`Getting the workspace with bundle id ${app_bundle_id} from database async...`);
//
//    const workspaces = await queryAsync('SELECT * FROM workspaces WHERE app_bundle_id = $1', [app_bundle_id]);
//    return workspaces[0];
//};
//
//const deleteByIdAsync = async (app_bundle_id) => {
//    console.info(`Deleting the workspace with bundle id ${app_bundle_id} from database async...`);
//
//    const workspaces = await queryAsync('DELETE FROM workspaces WHERE app_bundle_id = $1 RETURNING *', [app_bundle_id]);
//    return workspaces[0];
//
//};

module.exports = {
    addAsyncLaunchData,
    addAsyncInstallData,
//    getAllAsync,
//    getByIdAsync,
//    deleteByIdAsync
}