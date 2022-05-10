import { useState, useEffect } from 'react';
import { tokenToUsd } from 'services/btpServices';

function useTokenToUsd(symbol, balance, shouldFetch = true) {
  const [usdBalance, setUsdBalance] = useState(0);
  useEffect(() => {
    const getUsbalance = async () => {
      if (!symbol || !balance) {
        setUsdBalance(0);
      } else {
        try {
          const usdBalance = await tokenToUsd(symbol, balance);
          setUsdBalance(parseFloat(usdBalance?.content[0]?.value));
        } catch (error) {
          console.log(error);
        }
      }
    };
    if (shouldFetch) getUsbalance();
  }, [balance, symbol, shouldFetch]);

  return usdBalance;
}

export { useTokenToUsd };
