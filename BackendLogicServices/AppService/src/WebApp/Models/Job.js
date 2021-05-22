const ServerError = require('./ServerError.js');

class JobDatabaseBody {
    constructor (job) {
        this.id = job.id;
        this.app_bundle_id = job.app_bundle_id;
        this.pr_id = job.pr_id;
        this.summary = job.summary;
    }

    get Id () {
        return this.id;
    }

    get App_bundle_id () {
        return this.app_bundle_id;
    }

    get Pr_id () {
        return this.pr_id;
    }

    get Summary () {
        return this.summary;
    }
}

class JobResponse {
    constructor(id, summary, app_bundle_id, pr_id) {
        this.id = id;
        this.summary = summary;
        this.app_bundle_id = app_bundle_id;
        this.pr_id = pr_id;
    }
}

module.exports =  {
    JobDatabaseBody,
    JobResponse
}