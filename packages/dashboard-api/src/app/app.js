'use strict';

const express = require('express');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');
const { createBtpNetworkRoute } = require('../modules/btpnetwork');

const app = express();

app.use(express.json());
app.use(`/${process.env.API_VERSION}/btpnetwork`, createBtpNetworkRoute());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
