'use strict';

const http = require('http');
const { logger } = require('../common');
const app = require('./app');
const iconIndexer = require('../modules/icon-indexer');
const moonbeamIndexer = require('../modules/moonbeam-indexer');

function start() {
  // Separate Express 'app' and 'server'
  // https://github.com/goldbergyoni/nodebestpractices#-14-separate-express-app-and-server
  const server = http.createServer(app);

  server.listen(process.env.HOST_PORT, () => {
    logger.info(`Started application in ${process.env.NODE_ENV} mode`);
    logger.info('Listening at %o', server.address());
  });

  if ('true' === process.env.ICON_INDEXER_ENABLED) {
    iconIndexer.start();
  }

  if ('true' === process.env.MOONBEAM_INDEXER_ENABLED) {
    moonbeamIndexer.start();
  }
}

module.exports = {
  start
};
