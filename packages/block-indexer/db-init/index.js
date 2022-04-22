/* eslint-disable no-undef */
/* eslint-disable quotes */
const _ = require('lodash');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
const { Pool } = require('pg');
const pgPool = new Pool({ connectionString: process.env.POSTGRES_DB_URL });
pgPool.on('error', (error) => {
  console.log('error: Unexpected error on a Postgres client', error);
});

const updateRegisteredTokens = async () => {
  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');
    // 1. create table if not exists
    await Promise.all([
      // -- Table: public.registered_tokens
      `CREATE TABLE IF NOT EXISTS public.registered_tokens
        (
        tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
        network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
        token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
        contract_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
        create_at timestamp without time zone NOT NULL DEFAULT now(),
        token_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
        active integer NOT NULL DEFAULT 1,
        CONSTRAINT registered_tokens_pkey PRIMARY KEY (tx_hash),
        CONSTRAINT registered_tokens_network_id_token_name UNIQUE (network_id, token_name)
        );`,
      // -- Delete all rows --
      `DELETE FROM registered_tokens;`
    ].map(query => {
      return client.query(query, []);
    }));
    // 2. Register tokens
    const insertQueries = [];
    for (let i = 0; i < 100; i++) {
      const token = _.get(process.env, `REGISTERED_TOKENS_${i}`, null);
      if (token) {
        const splitToken = (token.replace(/\s+/g, '')).split('|');
        insertQueries.push(`INSERT INTO registered_tokens (tx_hash, contract_address, network_id, token_name, token_id) VALUES ('${splitToken[0]}', '${splitToken[1]}', '${splitToken[2]}', '${splitToken[3]}', '${splitToken[4]}');`);
      }
    }
    await Promise.all(insertQueries.map(query => {
      return client.query(query, []);
    }));
    await client.query('COMMIT');
    await console.log("Finish updating registered tokens...!");
  } catch (e) {
    console.log('error: ', e);
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
updateRegisteredTokens();
