'use strict';

const Web3 = require('web3');
const debug = require('debug')('mint_burn');
const { createLogger, ICX_LOOP_UNIT, CONTRACT_ZERO_ADDRESS, MINT_EVENT, BURN_EVENT } = require('../../common');
const { findEventByName, decodeEventLog } = require('../common/events');
const { getTokenName } = require('../tokens/model');
const { saveToken, getTotalTokenAmount } = require('./repository');

const TRANSFER_EVENT = 'Transfer';
const logger = createLogger();

// Transfer event
// Ref: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L246
class Web3MintBurnHandler {
  constructor(config) {
    this.config = { ...config };
    this.config.bmcAddress = config.bmcAddress.toLowerCase();
    this.web3 = new Web3(config.endpointUrl);
  }

  async run(tx, receipt, block) {
    const txTo = tx.to.toLowerCase();

    // Mint in a tx send to BSH but burn in a tx send to BMC.
    // Ref: https://github.com/icon-project/btp-dashboard/issues/465#issuecomment-966937077
    if (this.config.contractMap.has(txTo) || this.config.bmcAddress === txTo) {
      const transferEvent = findEventByName(TRANSFER_EVENT, this.config.eventMap, receipt.logs);

      if (transferEvent) {
        debug('Transfer event %O', transferEvent);
        logger.info(`Get ${TRANSFER_EVENT} event in tx ${transferEvent.id}, ${tx.hash}`);

        const eventData = decodeEventLog(this.web3, this.config.eventMap, TRANSFER_EVENT, transferEvent);
        debug('Transfer event decoded %O', eventData);

        await this.handleTransferEvent({
          ...eventData,
          logId: transferEvent.id
        }, tx, block);
      }
    }
  }

  /* Decoded Transfer event.
  {
    '0': '0x0000000000000000000000000000000000000000',
    '1': '0x87a8804BDC1Fe3bC1ad703F61685934E7b348413',
    '2': '99000000000000000',
    __length__: 3,
    from: '0x0000000000000000000000000000000000000000',
    to: '0x87a8804BDC1Fe3bC1ad703F61685934E7b348413',
    value: '99000000000000000',
    logId: 'log_bd2628a9'
  } */
  async handleTransferEvent(eventData, tx, block) {
    try {
      const tokenName = 'ICX'; // getTokenName(tx.to.toLowerCase());

      if (!tokenName) {
        logger.warn(`handleTransferEvent found unregistered token in tx ${eventData.logId}, ${tx.hash}`);
        return false;
      }

      const mintBurn = {
        tokenName,
        tokenValue: Number(eventData.value) / ICX_LOOP_UNIT,
        to: eventData.to.toLowerCase(),
        from: eventData.from.toLowerCase(),
        txHash: tx.hash,
        logId: eventData.logId,
        networkId: this.config.networkId,
        blockTime: this.web3.utils.hexToNumber(block.timestamp) * 1000
      };

      // Mint from zero address https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L267
      // Burn to zero address https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L295
      if (CONTRACT_ZERO_ADDRESS === mintBurn.from) {
        logger.info(`Mint ${mintBurn.tokenValue} ${mintBurn.tokenName} in tx ${eventData.logId}, ${tx.hash}`);

        const totalToken = await getTotalTokenAmount(mintBurn.tokenName, MINT_EVENT);
        await saveToken(mintBurn, totalToken, MINT_EVENT);
      } else if (CONTRACT_ZERO_ADDRESS === mintBurn.to) {
        logger.info(`Burn ${mintBurn.tokenValue} ${mintBurn.tokenName} in tx ${eventData.logId}, ${tx.hash}`);

        const totalToken = await getTotalTokenAmount(mintBurn.tokenName, BURN_EVENT);
        await saveToken(mintBurn, totalToken, BURN_EVENT);
      }
    } catch (error) {
      logger.error(`handleTransferEvent fails %O`, error);
    }
  }
}

module.exports = {
  Web3MintBurnHandler
};
