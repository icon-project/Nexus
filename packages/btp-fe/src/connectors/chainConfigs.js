import { custom } from './chainCustom';
import { ABI as currentABI } from 'connectors/MetaMask/ABI';

export const chainConfigs = {};
Object.keys(process.env).forEach((e) => {
  if (e.startsWith('REACT_APP_CHAIN')) {
    const chainName = e.split('_')[3];
    if (!chainConfigs[chainName]) {
      chainConfigs[chainName] = { id: chainName };
    }
    chainConfigs[chainName][e.split(chainName + '_')[1]] = process.env[e];
  }
});

Object.keys(custom).forEach((c) => {
  const { ABI } = custom[c];
  if (ABI) {
    ABI.forEach((ABIItem) => {
      const index = currentABI.findIndex((a) => ABIItem.name === a.name);
      if (index !== -1) {
        currentABI[index] = ABIItem;
      }
    });
  }
});

console.log('🚀 ~ file: chainConfigs.js ~ line 3 ~ currentABI', currentABI);

export const chainList = Object.values(chainConfigs);
