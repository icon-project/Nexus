'use strict';

const http = require('http');
const { logger } = require('../common');
const app = require('./app');
const blockIndexer = require('./block-indexer');

async function start() {
  // Separate Express 'app' and 'server'
  // https://github.com/goldbergyoni/nodebestpractices#-14-separate-express-app-and-server
  const server = http.createServer(app);

  server.listen(process.env.HOST_PORT, () => {
    logger.info(`Started application in ${process.env.NODE_ENV} mode`);
    logger.info('Listening at %o', server.address());
  });

  // usage: index.js <indexer>
  const args = process.argv.slice(2);
  await blockIndexer.start(args[0] || '');
}

module.exports = {
  start
};
