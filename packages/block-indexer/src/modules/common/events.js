'use strict';

const bshAbi = require('../bsc-indexer/abi/bsh.abi.json');

const bscEventMap = new Map();

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
    const bshEvents = getEventInfoFromAbi(web3, bshAbi, ['TransferSingle']);

    for (const event of bshEvents)
      bscEventMap.set(event.event.name, event);
  }

  return bscEventMap;
}

module.exports = {
  decodeEventLog,
  getBscEventMap,
  findEventByName
};
