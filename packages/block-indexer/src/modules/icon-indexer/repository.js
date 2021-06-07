'use strict';
const debug = require('debug')('icon');
const { v4: uuidv4 } = require('uuid');
const { logger, pgPool, TBL_NAME, ABP_FAS} = require('../../common');
//const { TBL_NAME } = require('../../common/');
const IconService = require('icon-sdk-js');
const { HttpProvider } = require('icon-sdk-js');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);
// Init call builder 
const { IconBuilder } = IconService;
const { CallBuilder } = IconBuilder;
const callBuilder = new CallBuilder();




function propsAsString(object) {
  return Object.keys(object).map(function (key) { return `"${object[key]}"`; }).join(', ');
}

function propsCountValueString(object) {
  return Object.keys(object).map(function (key, index) { return `$${index + 1}`; }).join(', ');
}

function sortValuesWithPropsOrdered(objectGetValue, orderPropsObject) {
  return Object.keys(orderPropsObject).map(function (key) { return objectGetValue[key]; });
}

// get list token registered in FAS
async function getListToken() {
  const callBuilder = new CallBuilder();
  const call = callBuilder
      .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
      .method('tokens')
      .build();
  try {
      const tokens = await iconService.call(call).execute();
      return tokens;
  } catch (e) {
      logger.error(e, 'getListToken() failed when execute get list tokens');
      throw new Error('"getListToken" job failed: ' + e.message);
  }
}

async function buildFASModel(block, result, method) {
  // get token name
  let NameToken = '';
  let TimeStamp = block.timeStamp;
  let BlockHeight = result.blockHeight;
  let BlockHash = block.blockHash;
  let PrevBlockHash = block.prevBlockHash;
  let TxHash = result.txHash;
  let Uuid = uuidv4();
  let CreateAt = Date.now();
  let UpdateAt = CreateAt;
  let DeleteAt = 0;
  let Value = 0;
  let FromAddress = '';
  let ToAddress = '';
  let ScoreAddress = '';
  if(method == "transfer") {
    const nameTokenFAS = await getNameToken(result.to);
    NameToken = nameTokenFAS;
    Value  = parseInt(result.eventLogs[0].indexed[3], 16);
    FromAddress = result.eventLogs[0].indexed[1];
    ToAddress = result.eventLogs[0].indexed[2];
    ScoreAddress = result.eventLogs[0].scoreAddress;

  } else if(method == 'transferFrom') {
    Value  = parseInt(result.eventLogs[0].data[1], 16);
    FromAddress = result.eventLogs[0].indexed[1];
    ToAddress = result.eventLogs[0].indexed[3];
    ScoreAddress = result.eventLogs[0].scoreAddress;

    // store name of token register in FAS by its ScoreAddress
    const tokensFAS = await getListToken();
    for( let token of tokensFAS) {
      if(token.address == ScoreAddress) {
        NameToken = token.name;
      }
    }
    if(NameToken == '') {
      logger.error(`Token in contract ${ScoreAddress} not registered yet with FAS`);
      return null;
    }

  } else {
    logger.error(`Invalid method name: ${method}`);
    return null;
  }

  return {
    id: Uuid,
    blockHeight: BlockHeight,
    receiveAt: TimeStamp,
    createAt: CreateAt,
    updateAt: UpdateAt,
    deleteAt: DeleteAt, 
    blockHash: BlockHash, 
    prevBlockHash: PrevBlockHash, 
    txHash: TxHash, 
    scoreAddress: ScoreAddress, 
    fromAddress: FromAddress, 
    toAddress: ToAddress, 
    nameToken: NameToken, 
    value: Value
  }
}

async function saveBlock(block) {}

async function saveTransaction(transaction, result) {}

async function getNameToken(contractAddress) {
  const call = callBuilder
  .to(contractAddress)
  .method('name')
  .build();
  try {
    const nameToken = await iconService.call(call).execute();
    return nameToken
  }catch(e) {
    logger.error(`[getNameToken] Failed to get name of token`, { e });
    throw e
  }
}

async function saveTransferFree(block, result, method) {
    const client = await pgPool.connect();
    // query string for insert database 
    const insertDealer = `INSERT INTO public.${TBL_NAME.AbpTransferFees}(${propsAsString(ABP_FAS)})
      VALUES (${propsCountValueString(ABP_FAS)})`;
    const insertFAS = await buildFASModel(block, result, method)
    try {
      await client.query(insertDealer, sortValuesWithPropsOrdered(insertFAS, ABP_FAS));
    } catch (e) {
      logger.error(`[saveTransferFree] Insert database error:  `, e);
      throw e;
    }
}

module.exports = {
  saveBlock,
  saveTransaction,
  saveTransferFree
};
