'use strict';

const bmcAbi = require('../bsc-indexer/abi/BMCManagement.json');

const bscActionMap = new Map();

// Build a map of [action hash, action]
function getActionInfoFromAbi(web3, contractAbi, actionNames) {
  const actions = contractAbi.filter((e) => 'function' === e.type && actionNames.includes(e.name));
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
  if (0 === bscActionMap.size) {
    const bmcActions = getActionInfoFromAbi(web3, bmcAbi, ['addRelay', 'removeRelay']);

    for (const action of bmcActions)
      bscActionMap.set(action.action.name, action);
  }

  return bscActionMap;
}

function decodeActionInput(web3, actionMap, actionName, encodedInput) {
  const action = actionMap.get(actionName);

  if (action && action.signature === encodedInput.slice(0, action.signature.length))
    return web3.eth.abi.decodeParameters(action.action.inputs, encodedInput.slice(action.signature.length));
}

module.exports = {
  getActionInfoFromAbi,
  getBscActionMap,
  decodeActionInput
};
