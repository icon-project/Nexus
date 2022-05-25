'use strict';
const root = require('path').join.bind(this, __dirname, '../../');
const debug = require('debug')('app');
const appEnv = require('dotenv-safe').config({
  silent: true,
  allowEmptyValues: true,
  path: root('.env'),
  sample: root('.env.example'),
});
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(appEnv);

const server = require('./server');

debug('Environment variables: %O', appEnv.parsed);

module.exports = server;
