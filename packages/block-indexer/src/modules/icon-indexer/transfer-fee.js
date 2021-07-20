'use strict';

const debug = require('debug')('icon');
const { customAlphabet } = require('nanoid/async');
const { logger, pgPool } = require('../../common');
const { getRegisteredTokens } = require('./fas');
const { hexToIcxUnit } = require('../../common/util');

const TRANSFER_EVENT_PROTOTYPE = 'Transfer(Address,Address,int,bytes)';
const nanoid = customAlphabet('1234567890abcdef', 10);

function isRegisteredToken(address) {
  return getRegisteredTokens().has(address);
}

function getTransferEvent(eventLogs) {
  try {
    for (const event of eventLogs) {
      if (TRANSFER_EVENT_PROTOTYPE === event.indexed[0] && process.env.FEE_AGGREGATION_SCORE_ADDRESS === event.indexed[2]) {
        const data = {
          tokenAmount: hexToIcxUnit(event.indexed[3])
        };

        debug('Get a Transfer event %O', data);
        return data;
      }
    }
  } catch (error) {
    throw Error(`Incorrect Transfer event data: ${error.message}`);
  }
}

async function saveTransferFee(fee) {
  try {
    const { rows } = await pgPool.query('SELECT total_token_amount FROM transfer_fees WHERE token_name=$1 ORDER BY created_time DESC LIMIT 1', [fee.tokenName]);
    const total = rows[0] ? Number(rows[0].total_token_amount) : 0;

    const query = 'INSERT INTO transfer_fees (id, tx_hash, token_name, token_amount, total_token_amount, created_time) VALUES ($1, $2, $3, $4, $5, NOW())';
    const values = [fee.id, fee.txHash, fee.tokenName, fee.tokenAmount, fee.tokenAmount + total];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error(`saveTransferFee fails with tx_hash ${fee.txHash}`, { error });
    throw error;
  }
}

async function handleTransferFeeEvents(txResult) {
  if (1 !== txResult.status || 0 === txResult.eventLogs.length || !isRegisteredToken(txResult.to))
    return false;

  try {
    const event = getTransferEvent(txResult.eventLogs);

    if (event) {
      const token = getRegisteredTokens().get(txResult.to);

      const fee = {
        ...event,
        id: await nanoid(),
        tokenName: token.name,
        txHash: txResult.txHash
      };

      debug('Get transfer fee %O', fee);
      await saveTransferFee(fee);
    }
  } catch (error) {
    logger.error(`${error.message} in txHash: ${txResult.txHash}`);
  }

  return true;
}

module.exports = {
  handleTransferFeeEvents,
  getTransferEvent
};
