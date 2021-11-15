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
