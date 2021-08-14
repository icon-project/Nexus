import { useState, useEffect } from 'react';

import { useSelect } from 'hooks/useRematch';
import { services } from 'services/transfer';

export const useTokenBalance = (currentSymbol) => {
  const [token, setToken] = useState({ balance: null, symbol: currentSymbol });

  const {
    accountInfo: { address, balance, unit, currentNetwork },
  } = useSelect(({ account: { selectAccountInfo } }) => ({
    accountInfo: selectAccountInfo,
  }));

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentNetwork && currentSymbol) {
      const isNativeCoin = currentSymbol === unit;

      if (isNativeCoin) {
        setToken({ balance, symbol: unit });
      } else {
        services.getBalanceOf(address, currentSymbol).then((result) => {
          setToken({ balance: result, symbol: currentSymbol });
        });
      }
    }
  }, [currentSymbol, currentNetwork]);

  return [token.balance, token.symbol];
};
