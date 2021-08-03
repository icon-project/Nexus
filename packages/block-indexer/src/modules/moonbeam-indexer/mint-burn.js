const debug = require('debug')('icon');
const { logger, pgPool } = require('../../common');
const { v4: uuidv4 } = require('uuid');
const { stringToNumberIcxUnit } = require('../../common/util');

const TRANSFER_SINGLE_PROTOTYPE  = 'TransferSingle(Address,Address,Address,int,int)';
const MOONBEAM_NETWORK_ID = 'Ox501';

async function handleMintEvents(transaction, block) {
  if ( 'transact' !== transaction.method.method || 
  TRANSFER_SINGLE_PROTOTYPE !== transaction.events[0].method.method ||
  '0x0' !== transaction.events[0].data[1] ) {
    return false;
  }
  try {
    const blockInfo = getBaseInfoBlock(block);

    const totalTokensAmount = await getTotalAmountToken(); 
      
    const mintObj = await getMintBurnEvent(transaction);

    await saveMintToken(mintObj, blockInfo, totalTokensAmount);
  } catch (error) {
    logger.error('handleMintEvents failed', { error });
    throw error;
  }
}

async function handleBurnEvents(transaction, block) {
  if ( 'transact' !== transaction.method.method || 
  TRANSFER_SINGLE_PROTOTYPE !== transaction.events[0].method.method ||
  '0x0' !== transaction.events[0].data[2] ) {
    return false;
  }
  try {
    const blockInfo = getBaseInfoBlock(block);

    const burnObj = await getMintBurnEvent(transaction);

    await saveBurnToken(burnObj, blockInfo, totalTokensAmount);
  } catch (error) {
    logger.error('handleBurnEvents failed', { error });
    throw error;
  }
}
async function saveBurnToken(mintObj, blockInfo, totalTokensAmount) {
  try {
    preSave(mintObj);

    const query = 'INSERT INTO burned_tokens (id, network_id, token_name, token_value, total_tokens_amount, block_time, block_height, block_hash, tx_hash, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
    const values = [mintObj.id, MOONBEAM_NETWORK_ID, mintObj.tokenName, mintObj.tokenValue, totalTokensAmount + mintObj.tokenValue, blockInfo.blockTime, blockInfo.blockHeight , blockInfo.blockHash , mintObj.txHash];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveBurnToken failed', { error });
    throw error;
  }
}

async function saveMintToken(mintObj, blockInfo, totalTokensAmount) {
  try {
    preSave(mintObj);

    const query = 'INSERT INTO minted_tokens (id, network_id, token_name, token_value, total_tokens_amount, block_time, block_height, block_hash, tx_hash, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())';
    const values = [mintObj.id, MOONBEAM_NETWORK_ID, mintObj.tokenName, mintObj.tokenValue, totalTokensAmount + mintObj.tokenValue, blockInfo.blockTime, blockInfo.blockHeight , blockInfo.blockHash , mintObj.txHash];

    await pgPool.query(query, values);
  } catch (error) {
    logger.error('saveMintToken failed', { error });
    throw error;
  }
}

function preSave(data) {
  if (!data.id) {
    data.id = uuidv4();
    data.createAt = Math.floor( new Date().getTime() );
  }
}

async function getTotalAmountToken() {
  const { rows } = await pgPool.query(`SELECT total_token_amount FROM minted_tokens WHERE token_name = ${mintObj.tokenName} ORDER BY create_at DESC LIMIT 1`);
  return rows[0] ? (rows[0].total_token_amount + mintObj.tokenValue) : 0;
}

async function getMintBurnEvent(transaction) {
  const name = getTokenNameById(transaction.events[0].data[3]);
  const value = stringToNumberIcxUnit(transaction.events[0].data[4]);

  return {
    txHash: transaction.hash,
    tokenName: name,
    tokenValue: value
  }
}

function getTokenNameById(id) {
  return 'BNB';
}

function getBaseInfoBlock(block) {
  return {
    blockTime: block.extrinsics[0].args.now,
    blockHash: block.hash,
    blockHight: block.number
  }
}


module.exports = {
  handleMintEvents,
  getMintBurnEvent,
  getBaseInfoBlock,
  handleBurnEvents
};