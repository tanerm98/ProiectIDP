const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const UsersController = require('./UsersController.js');
const RolesController = require('./RolesController.js');

Router.use('/v1/users', UsersController);
Router.use('/v1/roles', authorizeAndExtractTokenAsync, RolesController);

module.exports = Router;