'use strict';

const Web3 = require('web3');
const testAbi = require('../bsc-indexer/abi/TiendqCoin.json');

const bscEventMap = new Map();

function getEventInfoFromAbi(web3, contractAbi, eventNames) {
  const events = contractAbi.filter(e => 'event' === e.type && eventNames.includes(e.name));
  const result = [];

  for (const event of events) {
    const info = {
      hash: web3.eth.abi.encodeEventSignature(event),
      event
    };

    result.push(info);
  }

  return result;
}

function decodeEventLog(web3, eventMap, eventName, evmLogEvent) {
  const eventInfo = eventMap.get(eventName);
  return web3.eth.abi.decodeLog(eventInfo.event.inputs, evmLogEvent.data, evmLogEvent.topics.slice(1));
}

function findLogEventByName(eventName, eventMap, eventLogs) {
  const eventInfo = eventMap.get(eventName);

  for (const event of eventLogs) {
    if (eventInfo.hash === event.topics[0])
      return event;
  }
}

function buildBscEventMap() {
  if (0 === bscEventMap.size) {
    const web3 = new Web3(process.env.BSC_API_URL);
    const testEvents = getEventInfoFromAbi(web3, testAbi, ['CoinMinted', 'CoinSent']);

    for (const event of testEvents)
      bscEventMap.set(event.event.name, event);
  }

  return bscEventMap;
}

module.exports = {
  decodeEventLog,
  buildBscEventMap,
  findLogEventByName
};
