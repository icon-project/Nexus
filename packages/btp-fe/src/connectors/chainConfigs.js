import { custom } from './chainCustomization';
import { ABI as currentABI } from 'connectors/MetaMask/ABI';

export const chainConfigs = {};
Object.keys(process.env).forEach((e) => {
  if (e.startsWith('REACT_APP_CHAIN')) {
    const chainName = e.split('_')[3];
    if (!chainConfigs[chainName]) {
      chainConfigs[chainName] = { id: chainName, methods: {} };
    }
    chainConfigs[chainName][e.split(chainName + '_')[1]] = process.env[e];
  }
});

Object.keys(custom).forEach((c) => {
  const { ABI, methods } = custom[c];
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
    chainConfigs[c].methods = methods;
  }
});

if (process.env.JEST_WORKER_ID === undefined) {
  console.log('chainConfigs', chainConfigs);
}

export const chainList = Object.values(chainConfigs);
