const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const AuthorsController = require('./AuthorsController.js');
const UsersController = require('./UsersController.js');
const RolesController = require('./RolesController.js');
const BooksController = require('./BooksController.js');
const PublishersController = require('./PublishersController.js');

/**
 * TODO import controllers
 */

Router.use('/v1/authors', authorizeAndExtractTokenAsync, AuthorsController);
Router.use('/v1/books', authorizeAndExtractTokenAsync, BooksController);
Router.use('/v1/publishers', authorizeAndExtractTokenAsync, PublishersController);

Router.use('/v1/users', UsersController);
Router.use('/v1/roles', authorizeAndExtractTokenAsync, RolesController);

/**
 * TODO add controllers to main router
 */

module.exports = Router;