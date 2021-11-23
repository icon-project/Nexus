'use strict';

const moonbeamBshCoreAbi= require('../web3-indexer/abi/moonbeam/abi.bsh_core.json');
const moonbeamBshPeripheryAbi = require('../web3-indexer/abi/moonbeam/abi.bsh_periphery.json');
const bshCoreAbi = require('../bsc-indexer/abi/BSHCore.json');
const bshPeripheryAbi = require('../bsc-indexer/abi/BSHPeriphery.json');

const bscEventMap = new Map();
const moonbeamEventMap = new Map();

// Build a map of [event hash, event]
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

function decodeEventLog(web3, eventMap, eventName, eventData) {
  const eventDef = eventMap.get(eventName);
  return web3.eth.abi.decodeLog(eventDef.event.inputs, eventData.data, eventData.topics.slice(1));
}

function findEventByName(eventName, eventMap, eventLogs) {
  const eventDef = eventMap.get(eventName);

  for (const event of eventLogs) {
    if (eventDef.hash === event.topics[0])
      return event;
  }
}

function getBscEventMap(web3) {
  if (0 === bscEventMap.size) {
    let events = getEventInfoFromAbi(web3, bshCoreAbi, ['TransferSingle']);

    for (const event of events)
      bscEventMap.set(event.event.name, event);

    events = getEventInfoFromAbi(web3, bshPeripheryAbi, ['TransferStart', 'TransferEnd']);

    for (const event of events)
      bscEventMap.set(event.event.name, event);
  }

  return bscEventMap;
}

function getMoonbeamEventMap(web3) {
  if (0 === moonbeamEventMap.size) {
    let events = getEventInfoFromAbi(web3, moonbeamBshCoreAbi, ['TransferSingle']);

    for (const event of events)
      moonbeamEventMap.set(event.event.name, event);

    events = getEventInfoFromAbi(web3, moonbeamBshPeripheryAbi, ['TransferStart', 'TransferEnd']);

    for (const event of events)
      moonbeamEventMap.set(event.event.name, event);
  }

  return moonbeamEventMap;
}

module.exports = {
  decodeEventLog,
  getBscEventMap,
  getMoonbeamEventMap,
  findEventByName
};
