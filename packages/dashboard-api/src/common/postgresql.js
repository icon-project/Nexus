const { Pool } = require('pg');
const logger = require('./logger');

// Ref: https://node-postgres.com/features/connecting
const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
});

pool.on('error', (error) => {
  logger.error('Unexpected error on a Postgres client', error);
});

module.exports = pool;
