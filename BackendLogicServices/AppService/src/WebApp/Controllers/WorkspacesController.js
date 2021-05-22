const express = require('express');
const http = require('http');

const AuthorsRepository = require('../../Infrastructure/PostgreSQL/Repository/WorkspacesRepository.js');
const ServerError = require('../Models/ServerError.js');
const { AuthorPostBody, AuthorPutBody, AuthorResponse } = require('../Models/Author.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();


Router.get('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    const authors = await AuthorsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, authors.map(author => new AuthorResponse(author)));
});

Router.post('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    var test_data

    var myPayload = {
        file_id: "fdsfdsfds54543"
    };
    var myPayloadJson = JSON.stringify(myPayload);

    var options = {
        host: "192.168.0.108",
        port: 3004,
        path: '/api/run/Fitbit.Concentration',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length' : Buffer.byteLength(myPayloadJson, 'utf8')
        }
    };

    var reqPost = http.request(options, function(response) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            test_data = chunk;
        });
    })
    reqPost.write(myPayloadJson);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });

    var timeout = 10000;
    while (test_data == undefined) {
        timeout -= 500;
        await new Promise(r => setTimeout(r, 500));
        if (timeout <= 0) {
            break;
        }
    }

    console.log('TEST RESULTS: ' + test_data)
    ResponseFilter.setResponseDetails(res, 201, test_data);

});

module.exports = Router;