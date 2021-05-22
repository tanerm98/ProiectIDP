const express = require('express');
const http = require('http');

const WorkspacesRepository = require('../../Infrastructure/PostgreSQL/Repository/WorkspacesRepository.js');
const ServerError = require('../Models/ServerError.js');
const { WorkspacePostBody, WorkspacePutBody, WorkspaceResponse } = require('../Models/Workspace.js');
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

    app_bundle_id = String(app_bundle_id);

    console.info(`Received request to view workspace for bundle ID ${app_bundle_id}...`);

    const workspace = await WorkspacesRepository.getByIdAsync(app_bundle_id);

    if (!workspace) {
        throw new ServerError(`Workspace with bundle ID ${app_bundle_id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new WorkspaceResponse(workspace));
});

Router.delete('/:app_bundle_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        app_bundle_id
    } = req.params;

    app_bundle_id = String(app_bundle_id);

    console.info(`Received request to delete workspace for bundle ID ${app_bundle_id}...`);

    const workspace = await WorkspacesRepository.deleteByIdAsync(app_bundle_id);

    if (!workspace) {
        throw new ServerError(`Workspace with bundle id ${app_bundle_id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});


//Router.post('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
//
//    var test_data
//
//    var myPayload = {
//        file_id: "fdsfdsfds54543"
//    };
//    var myPayloadJson = JSON.stringify(myPayload);
//
//    var options = {
//        host: "192.168.0.108",
//        port: 3004,
//        path: '/api/run/Fitbit.Concentration',
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            'Content-Length' : Buffer.byteLength(myPayloadJson, 'utf8')
//        }
//    };
//
//    var reqPost = http.request(options, function(response) {
//        console.log('STATUS: ' + response.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(response.headers));
//        response.setEncoding('utf8');
//        response.on('data', function (chunk) {
//            console.log('BODY: ' + chunk);
//            test_data = chunk;
//        });
//    })
//    reqPost.write(myPayloadJson);
//    reqPost.end();
//    reqPost.on('error', function(e) {
//        console.error(e);
//    });
//
//    var timeout = 10000;
//    while (test_data == undefined) {
//        timeout -= 500;
//        await new Promise(r => setTimeout(r, 500));
//        if (timeout <= 0) {
//            break;
//        }
//    }
//
//    console.log('TEST RESULTS: ' + test_data)
//    ResponseFilter.setResponseDetails(res, 201, test_data);
//
//});

module.exports = Router;