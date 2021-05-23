const ServerError = require('./ServerError.js');

class WorkspacePostBody {
    constructor (body) {
        this.app_bundle_id = body.app_bundle_id;
        this.description = body.description;
        this.repository_link = body.repository_link;

        if (this.app_bundle_id == null) {
            throw new ServerError("Application bundle id name is missing", 400);
        }
    }

    get App_bundle_id () {
        return this.app_bundle_id;
    }

    get Description () {
        return this.description;
    }

    get Repository_link () {
        return this.repository_link;
    }
}

class WorkspaceResponse {
    constructor(workspace) {
        this.app_bundle_id = workspace.app_bundle_id;
        this.description = workspace.description;
        this.repository_link = workspace.repository_link;
    }
}

module.exports =  {
    WorkspacePostBody,
    WorkspaceResponse
}