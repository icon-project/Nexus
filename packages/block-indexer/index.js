'use strict';

const app = require('./src/app');
const { cronStart } = require('./src/cron');

(async () => {
  cronStart();
  await app.start();
})();
