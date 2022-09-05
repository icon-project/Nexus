import BAINIcon from 'assets/images/bain.svg';
import IconLogo from 'assets/images/icon-logo.svg';
import DollarIcon from 'assets/images/dollar.svg';
import CFTIcon from 'assets/images/cft.svg';
import FINIcon from 'assets/images/fin.svg';
import ETHIcon from 'assets/images/eth.svg';
import BTCIcon from 'assets/images/btc-large.svg';

const opportunitiesAssets = [
  {
    title: 'ICX',
    chain: 'ICON',
    protocol: '',
    apy: 'NEW ✨',
    totalAssets: '29,453,798',
    image: IconLogo,
  },
  {
    title: 'BALN',
    chain: 'ICON',
    protocol: 'Balance',
    apy: 'NEW ✨',
    totalAssets: '13,445,372',
    image: BAINIcon,
  },
  {
    title: 'bnUSD',
    chain: 'ICON',
    protocol: 'Balance',
    apy: 'NEW ✨',
    totalAssets: '3,410,552',
    explored: true,
    image: DollarIcon,
    type: 'BALN LP tokens',
    about:
      'Curve is an exchange liquidity title on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers, without an opportunity cost.',
    opportunityText: (
      <div>
        <h4>Convex Reinvest</h4>
        <p>
          Supplies RAI3CRV to Convex Finance to earn CRV and CVX (and any other available tokens).
          Earned tokens are harvested, sold for more RAI3CRV which is deposited back into the
          strategy.
        </p>
      </div>
    ),
    url: 'https://app.balanced.network',
  },
  {
    title: 'CFT',
    chain: 'ICON',
    protocol: '-',
    apy: '27.04%',
    totalAssets: '2,334,109',
    image: CFTIcon,
    explored: true,
    type: 'BALN LP tokens',
    about:
      'Curve is an exchange liquidity title on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers, without an opportunity cost.',
    opportunityText: (
      <div>
        <h4>Convex Reinvest</h4>
        <p>
          Supplies RAI3CRV to Convex Finance to earn CRV and CVX (and any other available tokens).
          Earned tokens are harvested, sold for more RAI3CRV which is deposited back into the
          strategy.
        </p>
      </div>
    ),
    url: 'https://app.balanced.network',
  },
  {
    title: 'FIN',
    chain: 'ICON',
    protocol: 'Yearn',
    apy: '7.24%',
    totalAssets: '2,144,469',
    image: FINIcon,
  },
];

const opportunitiesPools = [
  {
    title: 'ICX/ETH',
    chain: 'ICON',
    protocol: '',
    apy: 'NEW ✨',
    totalAssets: '29,453,798',
    image: IconLogo,
  },
  {
    title: 'BALN/sICX',
    chain: 'ICON',
    protocol: 'Balance',
    apy: 'NEW ✨',
    totalAssets: '13,445,372',
    image: BAINIcon,
  },
  {
    title: 'bnUSD/BALN',
    chain: 'ICON',
    protocol: 'Balance',
    apy: 'NEW ✨',
    totalAssets: '3,410,552',
    explored: true,
    image: DollarIcon,
    type: 'BALN LP tokens',
    about:
      'Curve is an exchange liquidity title on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers, without an opportunity cost.',
    opportunityText: (
      <div>
        <h4>Convex Reinvest</h4>
        <p>
          Supplies RAI3CRV to Convex Finance to earn CRV and CVX (and any other available tokens).
          Earned tokens are harvested, sold for more RAI3CRV which is deposited back into the
          strategy.
        </p>
      </div>
    ),
    url: 'https://app.balanced.network',
  },
  {
    title: 'CFT/ICX',
    chain: 'ICON',
    protocol: '-',
    apy: '27.04%',
    totalAssets: '2,334,109',
    image: CFTIcon,
    explored: true,
    type: 'BALN LP tokens',
    about:
      'Curve is an exchange liquidity title on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers, without an opportunity cost.',
    opportunityText: (
      <div>
        <h4>Convex Reinvest</h4>
        <p>
          Supplies RAI3CRV to Convex Finance to earn CRV and CVX (and any other available tokens).
          Earned tokens are harvested, sold for more RAI3CRV which is deposited back into the
          strategy.
        </p>
      </div>
    ),
    url: 'https://app.balanced.network',
  },
  {
    title: 'FIN/ETH',
    chain: 'ICON',
    protocol: 'Yearn',
    apy: '7.24%',
    totalAssets: '2,144,469',
    image: FINIcon,
  },
];

const highlightApyData = [
  {
    title: 'BaIn/sICX',
    apy: '27.04%',
    image: BAINIcon,
  },
  {
    title: 'ETH/sICX',
    apy: '18.43%',
    image: ETHIcon,
  },
  {
    title: 'BTC/sICX',
    apy: '12.07%',
    image: BTCIcon,
  },
];

const opportunityType = {
  asset: 'asset',
  pool: 'pool',
};

export { opportunitiesAssets, highlightApyData, opportunityType, opportunitiesPools };
