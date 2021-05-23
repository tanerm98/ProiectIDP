const {
    queryAsync
} = require('..');

const addAsync = async (app_bundle_id, description, repository_link) => {
    console.info(`Adding workspace in database async...`);

    const workspaces = await queryAsync('INSERT INTO workspaces (app_bundle_id, description, repository_link) VALUES ($1, $2, $3) RETURNING *', [app_bundle_id, description, repository_link]);
    return workspaces[0];
};

const getAllAsync = async () => {
    console.info(`Getting all workspaces from database async...`);

    return await queryAsync('SELECT * FROM workspaces');
};

const getByIdAsync = async (app_bundle_id) => {
    console.info(`Getting the workspace with bundle id ${app_bundle_id} from database async...`);

    const workspaces = await queryAsync('SELECT * FROM workspaces WHERE app_bundle_id = $1', [app_bundle_id]);
    return workspaces[0];
};

const deleteByIdAsync = async (app_bundle_id) => {
    console.info(`Deleting the workspace with bundle id ${app_bundle_id} from database async...`);

    const workspaces = await queryAsync('DELETE FROM workspaces WHERE app_bundle_id = $1 RETURNING *', [app_bundle_id]);
    return workspaces[0];
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    deleteByIdAsync
}