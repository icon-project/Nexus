'use strict';

const express = require('express');
const cors = require('cors');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');
const { createBtpNetworkRoute } = require('../modules/btpnetwork');
const { createAuctionRoute } = require('../modules/auctions');
const { createRelayRoute } = require('../modules/relays');
const { createTransRoute } = require('../modules/transactions');
const { createNetworksRoute} = require('../modules/networks');
const { createFeeRoute} = require('../modules/fees');

const app = express();
const version = process.env.API_VERSION;

app.use(cors());
app.use(express.json());
app.use(`/${version}/`, express.static('static'));
app.use(`/${version}/btpnetwork`, createBtpNetworkRoute());
app.use(`/${version}/networks`, createNetworksRoute());
app.use(`/${version}/auctions`, createAuctionRoute());
app.use(`/${version}/relays`, createRelayRoute());
app.use(`/${version}/transactions`, createTransRoute());
app.use(`/${version}/fees`, createFeeRoute());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
