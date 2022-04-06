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

export const chainList = Object.values(chainConfigs);
