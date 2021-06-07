'use strict';
const root = require('path').join.bind(this, __dirname, '../../');
const debug = require('debug')('app');
const { parsed } = require('dotenv-safe').config({
  silent: true,
  allowEmptyValues: true,
  path: root('.env'),
  sample: root('.env.example'),
});
const server = require('./server');

debug('Environment variables: %O', parsed);

module.exports = server;
