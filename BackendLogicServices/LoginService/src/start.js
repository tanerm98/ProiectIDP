'use strict';
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const createError = require('http-errors');

require('express-async-errors');
require('log-timestamp');

const routes = require('./WebApp/Controllers');

const ServerError = require('./WebApp/Models/ServerError.js');

const app = express();

app.use(helmet());
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        let status = 500;
        let message = 'Something Bad Happened';
        if (err instanceof ServerError) {
            message = err.Message;
            status = err.StatusCode;
        }
        return next(createError(status, message));
    }
});

const port = 3004;//process.env.PORT || 3003;

app.listen(port, () => {
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            //if (net.family === 'IPv4' && !net.internal) {
                console.log(net.address);
            //}
        }
    }
    console.log(`App is listening on ${port}`);
});
