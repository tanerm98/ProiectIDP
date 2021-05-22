const express = require('express');
const http = require('http');

const JobsRepository = require('../../Infrastructure/PostgreSQL/Repository/JobsRepository.js');
const MetricsRepository = require('../../Infrastructure/PostgreSQL/Repository/MetricsRepository.js');
const ServerError = require('../Models/ServerError.js');
const { JobDatabaseBody, JobResponse } = require('../Models/Job.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();


Router.post('/run/:app_bundle_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    const {
        app_bundle_id
    } = req.params

    app_bundle_id_str = String(app_bundle_id);
    var myPayloadJson = JSON.stringify(req.body);
    var test_data;

    console.info("Received request to run performance test job for application " + app_bundle_id);
    console.info("Request body: " + myPayloadJson);

    var options = {
        host: process.env.BUSINESSHOST,
        port: 3004,
        path: '/api/run/' + app_bundle_id_str,
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

    const test_data_json = JSON.parse(test_data)
    const test_results = test_data_json.results
    const test_summary = test_data_json.summary

    console.log(test_results)
    console.log(test_summary)

    var pr_id = 0;
    if (req.body.pr_number != null) {
        pr_id = req.body.pr_number;
    }

    const job = await JobsRepository.addAsync(app_bundle_id_str, pr_id, test_summary);

    const launches_data = test_results.LAUNCHES
    for (var i = 0; i < launches_data.length; i++) {
        var metric = launches_data[i];
        MetricsRepository.addAsyncLaunchData(app_bundle_id_str, metric.DEVICE, metric['LAUNCH TYPE'], metric['LAUNCH DURATION'], metric['MEMORY USAGE']);
    }
    MetricsRepository.addAsyncInstallData(app_bundle_id_str, test_results['APP SIZE'], test_results['FIRST LAUNCH AFTER INSTALL - DURATION'], test_results['FIRST LAUNCH AFTER INSTALL - MEMORY USAGE']);

    ResponseFilter.setResponseDetails(res, 201, new JobResponse(job.id, job.summary, job.app_bundle_id, job.pr_id));
});

Router.get('/bundle/:app_bundle_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.USER), async (req, res) => {
    let {
        app_bundle_id
    } = req.params;

    app_bundle_id_str = String(app_bundle_id);

    console.info('Received request to view job for bundle ID ' + app_bundle_id);

    const jobs = await JobsRepository.getAllForWorkspaceAsync(app_bundle_id);

    if (!jobs) {
        throw new ServerError(`Jobs for bundle ID ${app_bundle_id} do not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, jobs.map(job => new JobDatabaseBody(job)));
});

Router.get('/id/:job_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.USER), async (req, res) => {
    let {
        job_id
    } = req.params;

    job_id_str = String(job_id);

    console.info('Received request to view job wirh ID ' + job_id_str);

    const job = await JobsRepository.getByIdAsync(job_id_str);

    if (!job) {
        throw new ServerError(`Job for ID ${job_id_str} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new JobDatabaseBody(job));
});

Router.delete('/id/:job_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        job_id
    } = req.params;

    job_id_str = String(job_id);

    console.info(`Received request to delete job with ID ${job_id_str}...`);

    const job = await JobsRepository.deleteByIdAsync(job_id_str);

    if (!job) {
        throw new ServerError(`Job for ID ${job_id_str} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;