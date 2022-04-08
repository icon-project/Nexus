const services = require('./src/app');
const { cronStart } = require('./src/cron');
cronStart();
services.start();
