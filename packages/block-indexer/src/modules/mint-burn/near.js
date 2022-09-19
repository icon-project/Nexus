const { MINT_EVENT, BURN_EVENT } = require('../../common');
const logger = require('../../common/logger');
const { isJSON } = require('../../common/util');
const { getTokenName } = require('../tokens/model');
const { getTotalTokenAmount, saveToken } = require('./repository');

async function handleMintBurnEvents(tx, txResult, block) {
  if (process.env.NEAR_BMC_ADDRESS === tx.receiver_id) {
    for (const receiptOutcome of txResult?.receipts_outcome) {
      for (const log of receiptOutcome?.outcome?.logs) {
        if (!isJSON(log)) {
          return;
        }

        const data = JSON.parse(log);
        const mintBurn = {
          txHash: tx.hash,
          networkId: this.networkId,
          blockTime: Math.floor(block.header.timestamp / 1000)
        };
        try {
          const tokenName = getTokenName(data.contractAddress.toLowerCase());
          if (!tokenName) {
            logger.warn(`near:handleMintBurnEvents found unregistered token in tx ${tx.hash}`);
            return false;
          }

          if (data?.method.toLowerCase() === MINT_EVENT) {
            logger.info(`near:handleMintBurnEvents handle Mint event in tx ${tx.hash}`);

            mintBurn.tokenName = data.tokenName;
            mintBurn.tokenValue = Number(data.value);
            mintBurn.to = data.mintTo;

            const totalToken = await getTotalTokenAmount(mintBurn.tokenName, MINT_EVENT);
            await saveToken(mintBurn, totalToken, MINT_EVENT);
          } else if (data?.method.toLowerCase() === BURN_EVENT) {
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
