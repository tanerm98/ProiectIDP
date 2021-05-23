const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const WorkspacesController = require('./WorkspacesController.js');
const JobsController = require('./JobsController.js');
const MetricsController = require('./MetricsController.js');

Router.use('/v1/workspaces', authorizeAndExtractTokenAsync, WorkspacesController);
Router.use('/v1/jobs', authorizeAndExtractTokenAsync, JobsController);
Router.use('/v1/metrics', authorizeAndExtractTokenAsync, MetricsController);

module.exports = Router;