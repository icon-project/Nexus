import { custom } from './chainCustomization';
import { ABI as currentABI } from 'connectors/MetaMask/ABI';
import { ethers } from 'ethers';
import { IconConverter } from 'icon-sdk-js';

export const chainConfigs = {};
Object.keys(process.env).forEach((e) => {
  if (e.startsWith('REACT_APP_CHAIN')) {
    const chainName = e.split('_')[3];
    if (!chainConfigs[chainName]) {
      chainConfigs[chainName] = { id: chainName, methods: {}, tokens: [] };
    }
    chainConfigs[chainName][e.split(chainName + '_')[1]] = process.env[e];
  }
});

export const customzeChain = (chainId = '') => {
  const { ABI, methods } = custom[chainId] || {};
  if (ABI) {
    ABI.forEach((ABIItem) => {
      const index = currentABI.findIndex((a) => ABIItem.name === a.name);
      if (index !== -1) {
        currentABI[index] = ABIItem;
      } else {
        currentABI.push(ABIItem);
      }
    });
  }

  if (methods) {
    chainConfigs[chainId].methods = methods;
  }

  for (const c in custom) {
    delete custom[c].ABI;
    delete custom[c].methods;
    for (const prop in custom[c]) {
      chainConfigs[c][prop] = custom[c][prop];
    }
  }

  if (process.env.JEST_WORKER_ID === undefined) {
    console.log('chainConfigs', chainConfigs);
  }
};

export const chainList = Object.values(chainConfigs);

export const getCustomizedChainList = () => chainList.filter((chain) => !chain.disabled);

/**
 * get token list (e.g: ETH)
 * @returns {array}
 */
export const getTokenList = () => {
  let tokenList = [];
  for (const c in custom) {
    if (custom[c].tokens?.length > 0 && !custom[c]?.disabled) {
      tokenList = [...tokenList, ...custom[c].tokens.map((prop) => ({ ...prop, chainId: c }))];
    }
  }

  return tokenList;
};
export const checkIsToken = (token) => getTokenList().find((t) => t.symbol === token);

export const findChainbySymbol = (symbol) => {
  let chain = chainList.find((chain) => symbol == chain.COIN_SYMBOL);
  if (!chain) {
    const tokenChain = getTokenList().find((chain) => symbol == chain.symbol);
    if (!tokenChain) throw new Error('not found chain');
    chain = { ...chainConfigs[tokenChain.chainId], tokenOf: tokenChain.tokenOf };
  }

  return chain;
};

export const formatSymbol = (symbol) => {
  const chain = findChainbySymbol(symbol);

  return `btp-${chainConfigs[chain.tokenOf || chain.id].NETWORK_ADDRESS}-${symbol}`;
};

export const parseUnitsBySymbol = (amount, symbol, toHex = true) => {
  const chain = findChainbySymbol(symbol);
  const result = ethers.utils.parseUnits(amount, chain.decimals || 18).toString();
  return !toHex || chain.decimals === 24 ? result : IconConverter.toHex(result);
};

export const formatUnitsBySymbol = (amount, symbol) => {
  const chain = findChainbySymbol(symbol);
  return ethers.utils.formatUnits(amount, chain.decimals || 18).toString();
};
