const { MINT_EVENT, BURN_EVENT, NEAR_LOOP_UNIT } = require('../../common');
const { createLogger } = require('../../common/logger');
const { isJSON } = require('../../common/util');
const { getTotalTokenAmount, saveToken } = require('./repository');

const logger = createLogger();

async function handleMintBurnEvents(tx, txResult, block) {
  if (process.env.NEAR_BMC_ADDRESS === tx.receiver_id) {
    for (const receiptOutcome of txResult?.receipts_outcome) {
      for (const log of receiptOutcome?.outcome?.logs) {
        if (!isJSON(log) || (!log.toLowerCase().includes(MINT_EVENT) && !log.toLowerCase().includes(BURN_EVENT))) {
          continue;
        }

        const data = JSON.parse(log);
        if (!data.token_name) {
          continue;
        }

        const tokenName = data.token_name.split('-')[2];
        const mintBurn = {
          txHash: tx.hash,
          networkId: process.env.NEAR_NETWORK_ID,
          blockTime: Math.floor(block.header.timestamp / 1000)
        };
        try {
          if (!tokenName) {
            logger.warn(`near:handleMintBurnEvents found unregistered token in tx ${tx.hash}`);
            return false;
          }

          if (data?.event.toLowerCase() === MINT_EVENT) {
            logger.info(`near:handleMintBurnEvents handle Mint event in tx ${tx.hash}`);

            mintBurn.tokenName = tokenName;
            mintBurn.tokenValue = Number(data.amount) / (NEAR_LOOP_UNIT);
            mintBurn.to = data.mintTo;

            const totalToken = await getTotalTokenAmount(mintBurn.tokenName, MINT_EVENT);
            await saveToken(mintBurn, totalToken, MINT_EVENT);
          } else if (data?.event.toLowerCase() === BURN_EVENT) {
            logger.info(`near:handleMintBurnEvents handle Burn event in tx ${tx.hash}`);

            mintBurn.tokenName = data.tokenName;
            mintBurn.tokenValue = Number(data.value);
            mintBurn.from = data.tokenContract;

            const totalToken = await getTotalTokenAmount(mintBurn.tokenName, BURN_EVENT);
            await saveToken(mintBurn, totalToken, BURN_EVENT);
          }
        } catch (error) {
          logger.error('near:handleMintBurnEvents fails %O', error);
        }
      }
    }
  }
}

module.exports = {
  handleMintBurnEvents
};
