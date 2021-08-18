'use strict';

const Web3 = require('web3');
const abiBSHPeriphery = require('./abi/BSHPeriphery.abi.json');
const abiBSHScore= require('./abi/BSHScore.abi.json');

const web3 = new Web3(process.env.MOONBEAM_API_URL);
const eventMap = new Map();
const eventMapBSHScore = new Map(); 

function getEventInfoFromAbi(abi, eventNames) {
  const events = abi.filter(e => 'event' === e.type && eventNames.includes(e.name));
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

function buildEventMap() {
  const bshEvents = getEventInfoFromAbi(abiBSHPeriphery, ['TransferStart', 'TransferEnd']);

  for (const event of bshEvents)
    eventMap.set(event.event.name, event);

  return eventMap;
}

function buildBSHScoreEventMap() {
  const bshEvents = getEventInfoFromAbi(abiBSHScore, ['TransferBatch', 'TransferSingle']);

  for (const event of bshEvents)
    eventMapBSHScore.set(event.event.name, event);

  return eventMapBSHScore;
}

function getEventMap() {
  return eventMap;
}

function getEventMapBSHScore() {
  return eventMapBSHScore;
}

module.exports = {
  buildBSHScoreEventMap,
  getEventMapBSHScore,
  buildEventMap,
  getEventMap,
};
