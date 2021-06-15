'use strict';

const express = require('express');
const cors = require('cors');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');
const { createBtpNetworkRoute } = require('../modules/btpnetwork');
const { createAuctionRoute } = require('../modules/auctions');
const { createRelayRoute } = require('../modules/relays');
const { createTransRoute } = require('../modules/transactions');

const app = express();
const version = process.env.API_VERSION;
app.use(cors());
app.use(express.json());
app.use(`/${version}/btpnetwork`, createBtpNetworkRoute());
app.use(`/${version}/auctions`, createAuctionRoute());
app.use(`/${version}/relays`, createRelayRoute());
app.use(`/${version}/transactions`, createTransRoute());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
