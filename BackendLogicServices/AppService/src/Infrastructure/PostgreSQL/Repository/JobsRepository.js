const {
    queryAsync
} = require('..');

const addAsync = async (app_bundle_id, pr_id, summary) => {
    console.info(`Adding job in database async...`);

    const jobs = await queryAsync('INSERT INTO jobs (app_bundle_id, pr_id, summary) VALUES ($1, $2, $3) RETURNING *', [app_bundle_id, pr_id, summary]);
    return jobs[0];
};

const getAllForWorkspaceAsync = async (app_bundle_id) => {
    console.info(`Getting all jobs for a bundle ID from database async...`);

    return await queryAsync('SELECT * FROM jobs WHERE app_bundle_id = $1', [app_bundle_id]);
};

const getByIdAsync = async (job_id) => {
    console.info(`Getting the jobs with id ${job_id} from database async...`);

    const jobs = await queryAsync('SELECT * FROM jobs WHERE id = $1', [job_id]);
    return jobs[0];
};

const deleteByIdAsync = async (job_id) => {
    console.info(`Deleting the job with id ${job_id} from database async...`);

    const jobs = await queryAsync('DELETE FROM jobs WHERE id = $1 RETURNING *', [job_id]);
    return jobs[0];

};

module.exports = {
    addAsync,
    getAllForWorkspaceAsync,
    getByIdAsync,
    deleteByIdAsync
}