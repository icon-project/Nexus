'use strict';

const router = require('./route');

function createBtpNetworkRoute() {
  return router;
}

module.exports = {
  createBtpNetworkRoute,
};
