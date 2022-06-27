import { useState, useEffect } from 'react';

import { useSelect } from 'hooks/useRematch';
import { getService } from 'services/transfer';
import { getTokenList } from 'connectors/chainConfigs';

export const useTokenBalance = (currentSymbol, step) => {
  const [token, setToken] = useState({ balance: null, symbol: currentSymbol });

  const {
    accountInfo: { address, balance, symbol, currentNetwork },
  } = useSelect(({ account: { selectAccountInfo } }) => ({
    accountInfo: selectAccountInfo,
  }));

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentNetwork && currentSymbol) {
      setToken({ balance: 0, symbol: currentSymbol });
      const isNativeCoin = currentSymbol === symbol;

      if (isNativeCoin) {
        setToken({ balance, symbol: symbol });
      } else {
        const isToken = getTokenList().find((token) => token.symbol === currentSymbol);
        getService()
          .getBalanceOf({ address, symbol: currentSymbol, isToken: !!isToken })
          .then((result) => {
            setToken({ balance: result, symbol: currentSymbol });
          });
      }
    }
  }, [currentSymbol, currentNetwork, step]);

  return [token.balance, token.symbol];
};
