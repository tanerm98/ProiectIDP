const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const AuthorsController = require('./AuthorsController.js');
const BooksController = require('./BooksController.js');
const PublishersController = require('./PublishersController.js');

Router.use('/v1/authors', authorizeAndExtractTokenAsync, AuthorsController);
Router.use('/v1/books', authorizeAndExtractTokenAsync, BooksController);
Router.use('/v1/publishers', authorizeAndExtractTokenAsync, PublishersController);

module.exports = Router;