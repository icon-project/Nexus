'use strict';

const erc20Abi = require('../web3-indexer/abi/bsc/ERC20.json');
const bshPeripheryAbi = require('../web3-indexer/abi/bsc/BSHPeriphery.json');

const bscEventMap = new Map();

// Build a map of [event hash, event]
function getEventInfoFromAbi(web3, contractAbi, eventNames) {
  const events = contractAbi.filter(e => e.type === 'event' && eventNames.includes(e.name));
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

function decodeEventLog(web3, eventMap, eventName, eventData) {
  const eventDef = eventMap.get(eventName);
  return web3.eth.abi.decodeLog(eventDef.event.inputs, eventData.data, eventData.topics.slice(1));
}

function findEventByName(eventName, eventMap, eventLogs) {
  const eventDef = eventMap.get(eventName);

  if (eventDef) {
    for (const event of eventLogs) {
      if (eventDef.hash === event.topics[0]) { return event; }
    }
  }
}

function getBscEventMap(web3) {
  if (bscEventMap.size === 0) {
    let events = getEventInfoFromAbi(web3, erc20Abi, ['Transfer']);

    for (const event of events) { bscEventMap.set(event.event.name, event); }

    events = getEventInfoFromAbi(web3, bshPeripheryAbi, ['TransferStart', 'TransferEnd']);

    for (const event of events) { bscEventMap.set(event.event.name, event); }
  }

  return bscEventMap;
}

module.exports = {
  decodeEventLog,
  getBscEventMap,
  findEventByName
};
