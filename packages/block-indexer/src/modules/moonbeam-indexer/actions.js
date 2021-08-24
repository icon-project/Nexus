'use strict';

const Web3 = require('web3');
const abiBMCManagement = require('./abi/BMCManagement.abi.json');

const web3 = new Web3(process.env.MOONBEAM_API_URL);
const actionMap = new Map();

function getActionInfoFromAbi(abi, actionNames) {
  const actions = abi.filter((e) => 'function' === e.type && actionNames.includes(e.name));
  const result = [];

  for (const action of actions) {
    const info = {
      hash: web3.eth.abi.encodeFunctionSignature(action),
      action,
    };

    result.push(info);
  }

  return result;
}

function buildActionMap() {
  const bmcActions = getActionInfoFromAbi(abiBMCManagement, ['addRelay', 'removeRelay']);

  for (const action of bmcActions) actionMap.set(action.action.name, action);

  return actionMap;
}

function getActionMap() {
  return actionMap;
}

module.exports = {
  getActionInfoFromAbi,
  buildActionMap,
  getActionMap,
};
