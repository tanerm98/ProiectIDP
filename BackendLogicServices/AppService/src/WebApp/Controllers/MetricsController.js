const express = require('express');
const http = require('http');

const MetricsRepository = require('../../Infrastructure/PostgreSQL/Repository/MetricsRepository.js');
const ServerError = require('../Models/ServerError.js');
const { MetricPostBody, MetricResponse } = require('../Models/Metric.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.get('/:app_bundle_id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.USER), async (req, res) => {
    let {
        app_bundle_id
    } = req.params;

    app_bundle_id_str = String(app_bundle_id);

    console.info('Received request to view performance metric graphs for app bundle ID ' + app_bundle_id_str);

    const metricBody = new MetricPostBody(app_bundle_id_str, req.body);

    const launch_duration_data = await MetricsRepository.getLaunchDuration(app_bundle_id_str, metricBody.device, metricBody.launch_type, metricBody.limit)
    const launch_memory_data = await MetricsRepository.getLaunchMemory(app_bundle_id_str, metricBody.device, metricBody.launch_type, metricBody.limit)
    const install_duration_data = await MetricsRepository.getInstallDuration(app_bundle_id_str, metricBody.limit)
    const install_memory_data = await MetricsRepository.getInstallMemory(app_bundle_id_str, metricBody.limit)
    const app_size_data = await MetricsRepository.getAppSize(app_bundle_id_str, metricBody.limit)

    if (!launch_duration_data) {
        throw new ServerError(`Launch data for bundle ID ${app_bundle_id_str} does not exist!`, 404);
    }
    if (!install_duration_data) {
        throw new ServerError(`Data for bundle ID ${app_bundle_id_str} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new MetricResponse(launch_duration_data, launch_memory_data, install_duration_data, install_memory_data, app_size_data));
});

module.exports = Router;