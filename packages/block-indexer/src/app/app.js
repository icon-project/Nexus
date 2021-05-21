'use strict';

const express = require('express');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');

const app = express();

app.use(express.json());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
