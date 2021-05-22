const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const AuthorsController = require('./WorkspacesController.js');

Router.use('/v1/workspaces', authorizeAndExtractTokenAsync, AuthorsController);

module.exports = Router;