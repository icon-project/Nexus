'use strict';

const express = require('express');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');
const { createBtpNetworkRoute } = require('../modules/btpnetwork');
const { createAuctionRoute } = require('../modules/auctions');
var { path } = require('path');

const app = express();

//var dir = path.join(__dirname);
//var dir = path.join("__dirname", 'static');
//app.use(express.static(dir));
app.use(express.json());
app.use(`/${process.env.API_VERSION}/btpnetwork`, createBtpNetworkRoute());
app.use(`/${process.env.API_VERSION}/auctions`, createAuctionRoute());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
