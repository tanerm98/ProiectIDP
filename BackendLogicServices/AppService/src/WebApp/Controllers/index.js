const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const AuthorsController = require('./AuthorsController.js');

Router.use('/v1/authors', authorizeAndExtractTokenAsync, AuthorsController);

module.exports = Router;