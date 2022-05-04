export const custom = {
  ICON: {
    methods: {
      getBalanceOf: {
        payload: {
          symbol: process.env.REACT_APP_CHAIN_BSC_COIN_SYMBOL,
          to: process.env.REACT_APP_CHAIN_ICON_IRC2_ADDRESS,
        },
      },
    },
  },
  HARMONY: {
    disableWrappedCoin: true,
  },
};
