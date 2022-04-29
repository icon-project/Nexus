'use strict';

const express = require('express');
const cors = require('cors');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');
const { createBtpNetworkRoute } = require('../modules/btpnetwork');
// FAS: const { createAuctionRoute } = require('../modules/auctions');
const { createRelayRoute } = require('../modules/relays');
const { createTransRoute } = require('../modules/transactions');
const { createNetworksRoute } = require('../modules/networks');
// FAS: const { createFeeRoute } = require('../modules/fees');
const { createRelayCandidateRoute } = require('../modules/relay-candidates');
const { createTransactionIPRoute } = require('../modules/transaction-ips');

const app = express();
const version = process.env.API_VERSION;

app.use(cors());
app.use(express.json());
app.use(`/${version}/`, express.static('static'));
app.use(`/${version}/btpnetwork`, createBtpNetworkRoute());
app.use(`/${version}/networks`, createNetworksRoute());
// FAS: app.use(`/${version}/auctions`, createAuctionRoute());
app.use(`/${version}/relays`, createRelayRoute());
app.use(`/${version}/transactions`, createTransRoute());
app.use(`/${version}/transaction-ips`, createTransactionIPRoute());
// FAS: app.use(`/${version}/fees`, createFeeRoute());
app.use(`/${version}/relay-candidates`, createRelayCandidateRoute());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
