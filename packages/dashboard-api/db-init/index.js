/* eslint-disable quotes */
/* eslint-disable no-console */
require('dotenv').config();
const pgPool = require('../src/common/postgresql');
const { createDatabaseQuery } = require('./create-tables');
const { initialDataQuery } = require('./initial-data');
const { dropTableQuery } = require('./drop-tables');
const initialDB = () => {
  (async () => {
    const client = await pgPool.connect();
    try {
      await console.log("Begin migrating data...!");
      await client.query('BEGIN');
      // 0. Drop table
      await Promise.all(dropTableQuery.map(query => {
        return client.query(query, []);
      }));
      // 1. Create table
      await Promise.all(createDatabaseQuery.map(async (query) => {
        return client.query(query, []);
      }));
      // 2. Init data
      await Promise.all(initialDataQuery.map(query => {
        return client.query(query, []);
      }));
      await client.query('COMMIT');
      await console.log("Finish migration...!");
    } catch (e) {
      console.log('error: ', e);
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => console.log('error: ', e.stack));
};
initialDB();
