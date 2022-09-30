'use strict';

const debug = require('debug')('web3');
const { createLogger } = require('../../common');
const { decodeActionInput } = require('../common/actions');
const { refreshRegisteredTokens } = require('./model');
const { saveToken } = require('./repository');

const logger = createLogger();

// Ref: https://github.com/icon-project/btp/blob/icondao/solidity/bsh/contracts/BSHCore.sol#L176
class Web3TokenRegisterHandler {
  constructor(config, actionMap, web3) {
    this.bshAddress = config.bshAddress.toLowerCase();
    this.web3 = web3;
    this.actionMap = actionMap;
    this.bshAbi = config.bshAbi;
    this.networkId = config.networkId;
  }

  async run(tx, receipt, block) {
    const txTo = tx.to.toLowerCase();

    if (txTo !== this.bshAddress) { return false; }

    const input = this.getRegisterAction(tx.input);

    if (input) {
      logger.info('Found token register on %s', tx.hash);
      await this.registerERC20Token(input, tx);
    }
  }

  getRegisterAction(encodedInput) {
    try {
      const result = decodeActionInput(this.web3, this.actionMap, 'register', encodedInput);

      if (result) {
        /* info: moonbeam:getBlockData received block 1684372, 0x2a5db5a7e1abc5d68055c4a8b3ea9c402e1696b5960b191920283095340ca00c
        web3 register Result {
        web3   '0': 'ICON',
        web3   '1': 'ICX',
        web3   '2': '18',
        web3   __length__: 3,
        web3   _name: 'ICON',
        web3   _symbol: 'ICX',
        web3   _decimals: '18'
        web3 } +35s */
        debug('register %O', result);

        return {
          tokenName: result._name,
          tokenId: result._symbol
        };
      }
    } catch (error) {
      logger.error('getRegisterAction fails to decode input %O', error);
    }
  }

  async registerERC20Token(input, tx) {
    try {
      const bsh = new this.web3.eth.Contract(this.bshAbi, this.bshAddress);
      const address = await bsh.methods.coinId(input.tokenName).call();

      const token = {
        networkId: this.networkId,
        tokenName: input.tokenName,
        tokenId: input.tokenId,
        contractAddress: address,
        txHash: tx.hash
      };

      if (await saveToken(token)) {
        logger.info(`Saved new ERC20 token ${token.tokenName} on tx ${token.txHash}`);
        await refreshRegisteredTokens();
      }
    } catch (error) {
      logger.error('registerERC20Token fails on tx %s with %O', tx.hash, error);
    }
  }
}

module.exports = {
  Web3TokenRegisterHandler
};
