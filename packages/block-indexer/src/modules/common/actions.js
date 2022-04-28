
'use strict';

const bmcAbi = require('../bsc-indexer/abi/BMCManagement.json');
const moonbeamBmcAbi = require('../web3-indexer/abi/moonbeam/abi.bmc_management.json');
const moonbeamBshAbi = require('../web3-indexer/abi/moonbeam/abi.bsh_core.json');

const bscActionMap = new Map();
const moonbeamActionMap = new Map();

// Build a map of [action hash, action]
function getActionInfoFromAbi(web3, contractAbi, actionNames) {
  const actions = contractAbi.filter((e) => e.type === 'function' && actionNames.includes(e.name));
  const result = [];

  for (const action of actions) {
    const info = {
      signature: web3.eth.abi.encodeFunctionSignature(action), // first 4 bytes hash e.g. 0x0748ea7a
      action
    };

    result.push(info);
  }

  return result;
}

function getBscActionMap(web3) {
  if (bscActionMap.size === 0) {
    let actions = getActionInfoFromAbi(web3, bmcAbi, ['addRelay', 'removeRelay']);

    for (const action of actions) { bscActionMap.set(action.action.name, action); }

    actions = getActionInfoFromAbi(web3, moonbeamBshAbi, ['register']);

    for (const action of actions) { bscActionMap.set(action.action.name, action); }
  }

  return bscActionMap;
}

function getMoonbeamActionMap(web3) {
  if (moonbeamActionMap.size === 0) {
    let actions = getActionInfoFromAbi(web3, moonbeamBmcAbi, ['addRelay', 'removeRelay']);

    for (const action of actions) { moonbeamActionMap.set(action.action.name, action); }

    actions = getActionInfoFromAbi(web3, moonbeamBshAbi, ['register']);

    for (const action of actions) { moonbeamActionMap.set(action.action.name, action); }
  }

  return moonbeamActionMap;
}

function decodeActionInput(web3, actionMap, actionName, encodedInput) {
  const action = actionMap.get(actionName);

  if (action && action.signature === encodedInput.slice(0, action.signature.length)) { return web3.eth.abi.decodeParameters(action.action.inputs, encodedInput.slice(action.signature.length)); }
}

module.exports = {
  getActionInfoFromAbi,
  getBscActionMap,
  decodeActionInput,
  getMoonbeamActionMap
};
