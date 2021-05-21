'use strict';

const debug = require('debug')('app');
const { parsed } = require('dotenv-safe').config({ silent: true, allowEmptyValues: true });
const server = require('./server');

debug('Environment variables: %O', parsed);

module.exports = server;
