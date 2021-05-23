const express = require('express');
const http = require('http');

const WorkspacesRepository = require('../../Infrastructure/PostgreSQL/Repository/WorkspacesRepository.js');
const ServerError = require('../Models/ServerError.js');
const { WorkspacePostBody, WorkspaceResponse } = require('../Models/Workspace.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();


Router.post('/create', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    console.info("Received request to create workspace...");

    const workspaceBody = new WorkspacePostBody(req.body);
    const workspace = await WorkspacesRepository.addAsync(workspaceBody.app_bundle_id, workspaceBody.description, workspaceBody.repository_link);

    ResponseFilter.setResponseDetails(res, 200, new WorkspaceResponse(workspace));
});

Router.get('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.USER), async (req, res) => {
    console.info("Received request to retrieve all workspaces...");

    const workspaces = await WorkspacesRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, workspaces.map(workspace => new WorkspaceResponse(workspace)));
});

Router.get('/:app_bundle_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.USER), async (req, res) => {
    let {
        app_bundle_id
    } = req.params;

    app_bundle_id_str = String(app_bundle_id);

    console.info(`Received request to view workspace for bundle ID ${app_bundle_id_str}...`);

    const workspace = await WorkspacesRepository.getByIdAsync(app_bundle_id_str);

    if (!workspace) {
        throw new ServerError(`Workspace with bundle ID ${app_bundle_id_str} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new WorkspaceResponse(workspace));
});

Router.delete('/:app_bundle_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        app_bundle_id
    } = req.params;

    app_bundle_id_str = String(app_bundle_id);

    console.info(`Received request to delete workspace for bundle ID ${app_bundle_id_str}...`);

    const workspace = await WorkspacesRepository.deleteByIdAsync(app_bundle_id_str);

    if (!workspace) {
        throw new ServerError(`Workspace with bundle id ${app_bundle_id_str} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;