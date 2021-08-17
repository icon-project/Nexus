export const wallets = {
  metamask: 'metamask',
  iconex: 'iconex',
};

export const connectedNetWorks = {
  icon: 'ICON blockchain',
  moonbeam: 'Moonbase Alpha',
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
};

export const tokenOptionList = Object.values(nativeTokens).map(({ symbol }) => ({
  name: symbol,
  value: symbol,
}));

export const SUCCESS_TRANSACTION = 'SUCCESS_TRANSACTION';
