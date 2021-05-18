const express = require('express');

const RolesRepository = require('../../Infrastructure/PostgreSQL/Repository/RolesRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    RolePostBody,
    RoleResponse
} = require('../Models/Role.js');

const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {
    
    const roleBody = new RolePostBody(req.body);

    const role = await RolesRepository.addAsync(roleBody.Value);

    ResponseFilter.setResponseDetails(res, 201, new RoleResponse(role), req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {

    const roles = await RolesRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, roles.map(role => new RoleResponse(role)));
});

module.exports = Router;