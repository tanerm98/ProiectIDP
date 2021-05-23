const express = require('express');
const http = require('http');

const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const ServerError = require('../Models/ServerError.js');
const { UserPostBody, UserResponse } = require('../Models/User.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.get('/analytics/', AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {

    console.info('Received request to view analytics graphs for users...');

    const userDataBody = new UserPostBody(req.body);

    const registers_data = await UsersRepository.getUserRegisters(userDataBody.limit)
    const logins_data = await UsersRepository.getUserLogin(userDataBody.limit)
    const jobs_data = await UsersRepository.getRunJobs(userDataBody.limit)

    if (!registers_data) {
        throw new ServerError(`User analytics data does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new UserResponse(registers_data, logins_data, jobs_data));
});

module.exports = Router;