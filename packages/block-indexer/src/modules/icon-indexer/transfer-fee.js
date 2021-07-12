'use strict';

const debug = require('debug')('icon');
const { customAlphabet } = require('nanoid/async');
const { logger, pgPool, tokenToUsd } = require('../../common');
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
    const { rows } = await pgPool.query('SELECT total_fee_usd FROM transfer_fees ORDER BY created_time DESC LIMIT 1');

    if (0 === rows.length)
      return false;

    const totalFee = Number(rows[0].total_fee_usd);

    const query = 'INSERT INTO transfer_fees (id, tx_hash, token_name, token_amount, token_amount_usd, total_fee_usd, created_time) VALUES ($1, $2, $3, $4, $5, $6, NOW())';
    const values = [fee.id, fee.txHash, fee.tokenName, fee.tokenAmount, fee.tokenAmountUsd, fee.tokenAmountUsd + totalFee];

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
      const tokenAmountUsd = await tokenToUsd(token.name, event.tokenAmount);

      const fee = {
        ...event,
        tokenAmountUsd,
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
