'use strict';

const debug = require('debug')('icon');
const { logger, ICX_LOOP_UNIT, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { decode } = require('rlp');

async function handleRelayerEvent(txResult, transaction) {
  if( ('registerRelayer' === transaction.data.method || 'unregisterRelayer' === transaction.data.method) && 1 === txResult.status) {
    const relayerObj = {
      relayerAddress: transaction.from,
      bondedToAddress: transaction.to,
      blockTime: new Date(transaction.timestamp / 1000),
      id: uuidv4(),
      serverStatus: 'Active'
    };

    if('registerRelayer' === transaction.data.method ) {
      relayerObj.valueBonded =  Number(transaction.value.c[0]) / ICX_LOOP_UNIT;
      relayerObj.description = transaction.data.params._desc;

      const isRelayerExisted = await checkRelayerExisted(relayerObj.relayerAddress);

      if(isRelayerExisted) {
        await updateRelayerInfo(relayerObj, txResult);
      } else {
        await saveRelayerInfo(relayerObj, txResult);
      }

    } else if ('unregisterRelayer' === transaction.data.method) {
      relayerObj.serverStatus = 'Inactive';
      await updateRelayerInfo(relayerObj, txResult);
    }

  }
}

async function checkRelayerExisted(relayerAddress) {
  try {
    const { rows } = await pgPool.query( 'SELECT id FROM relayers WHERE address_relayer=$1', [relayerAddress]);

    return rows[0].id ? true : false;
  } catch (error) {
    logger.error('isRelayerExisted failed ', { error });
  }
}

async function saveRelayerInfo(relayerObj, txResult) {
  try {
    const query = 'INSERT INTO relayers (id, description, address_relayer, address_bonded_to, bonded_icx, server_status, tx_hash, block_hash, block_height, registered_time, created_time, updated_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())';
    const values = [relayerObj.id, relayerObj.description, relayerObj.relayerAddress, relayerObj.bondedToAddress, relayerObj.valueBonded, relayerObj.serverStatus, txResult.txHash, txResult.blockHash, txResult.blockHeight, relayerObj.blockTime ];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveRelayerInfo failed ', { error });
  }
}

async function updateRelayerInfo(relayerObj, txResult) {
  try {
    let query, values;
    if(relayerObj.serverStatus === 'Active') {
      query = 'UPDATE relayers SET description = $2, address_bonded_to = $3, bonded_icx = $4, tx_hash = $5, block_hash = $6, block_height = $7, server_status = $8, registered_time = NOW(), updated_time = NOW() WHERE address_relayer = $1';
      values = [relayerObj.relayerAddress, relayerObj.description, relayerObj.bondedToAddress, relayerObj.valueBonded, txResult.txHash, txResult.blockHash, txResult.blockHeight, relayerObj.serverStatus];
      
    } else {
      query = 'UPDATE relayers SET tx_hash = $2, block_hash = $3, block_height = $4, unregistered_time = NOW(), server_status = $5, updated_time = NOW() WHERE address_relayer = $1';
      values = [relayerObj.relayerAddress, txResult.txHash, txResult.blockHash, txResult.blockHeight, relayerObj.serverStatus];
    }
    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveRelayerInfo failed ', { error });
  }
}

module.exports = {
  handleRelayerEvent
};