'use strict';

const debug = require('debug')('relay_tx');
const { createLogger, ADD_RELAY_ACTION, REMOVE_RELAY_ACTION } = require('../../common');
const { decodeActionInput } = require('../common/actions');
const { getRegisteredRelayMap } = require('./model');
const { setRelayUnregistered, createRelay } = require('./repository');

const logger = createLogger();

class Web3RelayHandler {
  constructor(config, actionMap, web3) {
    this.networkName = config.name;
    this.bmcMgmtAddress = config.bmcMgmtAddress;
    this.web3 = web3;
    this.actionMap = actionMap;
  }

  /* Decoded addRelay input.
  Result {
    '0': 'btp://0xd35bbb.icon/cx11db74c77d4b8ac2e30ff5d73341c8c741be75ae',
    '1': [ '0x70E789D2f5D469eA30e0525DbfDD5515d6EAd30D' ],
    __length__: 2,
    _link: 'btp://0xd35bbb.icon/cx11db74c77d4b8ac2e30ff5d73341c8c741be75ae',
    _addr: [ '0x70E789D2f5D469eA30e0525DbfDD5515d6EAd30D' ]
  } */
  getAddRelayAction(encodedInput) {
    try {
      const result = decodeActionInput(this.web3, this.actionMap, ADD_RELAY_ACTION, encodedInput);

      if (result) {
        debug('addRelay %O', result);

        return {
          link: result._link,
          addresses: result._addr
        };
      }
    } catch (error) {
      logger.error(`${this.networkName}:getAddRelayAction fails to decode input %O`, error);
    }
  }

  getRemoveRelayAction(encodedInput) {
    try {
      const result = decodeActionInput(this.web3, this.actionMap, REMOVE_RELAY_ACTION, encodedInput);

      if (result) {
        debug('removeRelay %O', result);

        return {
          link: result._link,
          address: result._addr
        };
      }
    } catch (error) {
      logger.error(`${this.networkName}:getRemoveRelayAction fails to decode input %O`, error);
    }
  }

  async handleAddRelayAction(input, tx, block) {
    for (const address of input.addresses) {
      const relay = {
        txHash: tx.hash,
        link: input.link,
        address: address.toLowerCase(),
        registeredTime: new Date(this.web3.utils.hexToNumber(block.timestamp) * 1000),
        serverStatus: 'Active'
      };

      const success = await createRelay(relay);

      if (success) {
        const relayMap = await getRegisteredRelayMap();
        relayMap.set(relay.address, relay.address);
        logger.info(`${this.networkName}:handleAddRelayAction registers relay %s at tx %s`, relay.link, tx.hash);
      }
    }
  }

  async handleRemoveRelayAction(input, tx, block) {
    const relay = {
      address: input.address.toLowerCase(),
      unregisteredTime: new Date(this.web3.utils.hexToNumber(block.timestamp) * 1000),
      serverStatus: 'Inactive'
    };

    const success = await setRelayUnregistered(relay);

    if (success) {
      const relayMap = await getRegisteredRelayMap();
      relayMap.delete(relay.address);
      logger.info(`${this.networkName}:handleRemoveRelayAction unregisters relay %s at tx %s`, relay.address, tx.hash);
    }
  }

  async run(tx, block) {
    if (this.bmcMgmtAddress !== tx.to.toLowerCase()) { return false; }

    let actionInput = this.getAddRelayAction(tx.input);

    if (actionInput) {
      logger.info(`${this.networkName}:handleRelayActions addRelay %O at tx %s`, actionInput, tx.hash);
      await this.handleAddRelayAction(actionInput, tx, block);
      return true;
    }

    actionInput = this.getRemoveRelayAction(tx.input);

    if (actionInput) {
      logger.info(`${this.networkName}:handleRelayActions removeRelay %O at tx %s`, actionInput, tx.hash);
      await this.handleRemoveRelayAction(actionInput, tx, block);
      return true;
    }
  }
}
module.exports = {
  Web3RelayHandler
};
