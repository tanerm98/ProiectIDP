const express = require('express');

const AuthorsRepository = require('../../Infrastructure/PostgreSQL/Repository/AuthorsRepository.js');
const ServerError = require('../Models/ServerError.js');
const { AuthorPostBody, AuthorPutBody, AuthorResponse } = require('../Models/Author.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    
    const authorBody = new AuthorPostBody(req.body);

    const author = await AuthorsRepository.addAsync(authorBody.FirstName, authorBody.LastName);

    ResponseFilter.setResponseDetails(res, 201, new AuthorResponse(author), req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    const authors = await AuthorsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, authors.map(author => new AuthorResponse(author)));
});

Router.get('/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
       
    const author = await AuthorsRepository.getByIdAsync(id);
    
    if (!author) {
        throw new ServerError(`Author with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new AuthorResponse(author));
});

Router.put('/:id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    const authorBody = new AuthorPutBody(req.body, req.params.id);

    const author = await AuthorsRepository.updateByIdAsync(authorBody.Id, authorBody.FirstName, authorBody.LastName);
        
    if (!author) {
        throw new ServerError(`Author with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new AuthorResponse(author));
});

Router.delete('/:id', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    const {
        id
    } = req.params;

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    const author = await AuthorsRepository.deleteByIdAsync(parseInt(id));
    
    if (!author) {
        throw new ServerError(`Author with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;