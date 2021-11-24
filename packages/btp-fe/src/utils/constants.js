export const wallets = {
  metamask: 'metamask',
  iconex: 'iconex',
  hana: 'hana',
};

export const connectedNetWorks = {
  icon: 'ICON blockchain',
  moonbeam: 'Moonbase Alpha',
  bsc: 'Binance Smart Chain',
};

export const nativeTokens = {
  [connectedNetWorks.icon]: {
    symbol: 'ICX',
    netWorkLabel: 'ICON',
  },
  [connectedNetWorks.moonbeam]: {
    symbol: 'DEV',
    netWorkLabel: 'Moonbeam',
  },
  [connectedNetWorks.bsc]: {
    symbol: 'BNB',
    netWorkLabel: 'Binance',
  },
};

export const tokenOptionList = Object.values(nativeTokens);

export const SUCCESS_TRANSACTION = 'SUCCESS_TRANSACTION';

export const PAIRED_NETWORKS = 'PAIRED_NETWORKS';
export const pairedNetworks = {
  'ICON-Moonbeam': 'ICON-Moonbeam',
  'ICON-BSC': 'ICON-BSC',
};

export const getPairedNetwork = () => localStorage.getItem(PAIRED_NETWORKS);
export const isICONAndBSHPaired = () => getPairedNetwork() === pairedNetworks['ICON-BSC'];
export const getTokenOptions = () =>
  isICONAndBSHPaired()
    ? nativeTokens[connectedNetWorks.bsc]
    : nativeTokens[connectedNetWorks.moonbeam];
