'use strict';

const Web3 = require('web3');
const debug = require('debug')('mint_burn');
const { createLogger, ICX_LOOP_UNIT, CONTRACT_ZERO_ADDRESS, MINT_EVENT, BURN_EVENT } = require('../../common');
const { findEventByName, decodeEventLog } = require('../common/events');
const { getTokenName } = require('../tokens/model');
const { saveToken, getTotalTokenAmount } = require('./repository');

const TRANSFER_SINGLE_EVENT = 'TransferSingle';
const logger = createLogger();

// No mint/burn events for ERC20 tokens e.g. ETH
// Ref: https://github.com/icon-project/btp-dashboard/issues/479#issuecomment-966906028
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
      const transferSingle = findEventByName(TRANSFER_SINGLE_EVENT, this.config.eventMap, receipt.logs);

      if (transferSingle) {
        debug('TransferSingle %O', transferSingle);
        logger.info(`${this.config.name}:Get ${TRANSFER_SINGLE_EVENT} event in tx ${tx.hash}`);

        const eventData = decodeEventLog(this.web3, this.config.eventMap, TRANSFER_SINGLE_EVENT, transferSingle);
        debug('TransferSingle decoded %O', eventData);
        await this.handleTransferSingleEvent(eventData, tx, block);
      }
    }
  }

  /*
  Decoded TransferSingle event.

  Result {
    '0': '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
    '1': '0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D',
    '2': '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
    '3': '74645123150620096120801602238006067452189572593452417212166420008730219938226',
    '4': '100000000000000000',
    __length__: 5,
    operator: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
    from: '0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D',
    to: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
    id: '74645123150620096120801602238006067452189572593452417212166420008730219938226',
    value: '100000000000000000'
  }
  */
  async handleTransferSingleEvent(eventData, tx, block) {
    try {
      const tokenId = '0x' + eventData.id;
      const tokenName = getTokenName(this.config.networkId, tokenId);

      if (!tokenName) {
        logger.warn(`${this.config.name}:handleTransferSingleEvent found unregistered token ${tokenId}`);
        return false;
      }

      const mintBurn = {
        tokenId,
        tokenName,
        tokenValue: Number(eventData.value) / ICX_LOOP_UNIT,
        to: eventData.to.toLowerCase(),
        from: eventData.from.toLowerCase(),
        txHash: tx.hash,
        networkId: this.config.networkId,
        blockTime: this.web3.utils.hexToNumber(block.timestamp) * 1000
      };

      if (CONTRACT_ZERO_ADDRESS === mintBurn.from) {
        logger.info(`${this.config.name}:Mint ${mintBurn.tokenValue} ${mintBurn.tokenName} in tx ${tx.hash}`);

        const totalToken = await getTotalTokenAmount(mintBurn.tokenName, MINT_EVENT);
        await saveToken(mintBurn, totalToken, MINT_EVENT);
      } else {
        logger.info(`${this.config.name}:Burn ${mintBurn.tokenValue} ${mintBurn.tokenName} in tx ${tx.hash}`);

        const totalToken = await getTotalTokenAmount(mintBurn.tokenName, BURN_EVENT);
        await saveToken(mintBurn, totalToken, BURN_EVENT);
      }
    } catch (error) {
      logger.error(`${this.config.name}:handleTransferSingleEvent fails %O`, error);
    }
  }
}

module.exports = {
  Web3MintBurnHandler
};
