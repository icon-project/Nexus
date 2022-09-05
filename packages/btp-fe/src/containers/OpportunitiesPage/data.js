// import IconExIcon from 'assets/images/icon-ex.svg';
import BAINIcon from 'assets/images/bain.svg';
import IconLogo from 'assets/images/icon-logo.svg';
import DollarIcon from 'assets/images/dollar.svg';
import CFTIcon from 'assets/images/cft.svg';
import FINIcon from 'assets/images/fin.svg';
import ETHIcon from 'assets/images/eth.svg';
import BTCIcon from 'assets/images/btc-large.svg';

const opportunitiesAssets = [
  {
    pool: 'ICX/ETH',
    chain: 'ICON',
    protocol: '',
    apy: 'NEW ✨',
    totalAssets: '29,453,798',
    explored: true,
    image: IconLogo,
  },
  {
    pool: 'BALN/sICX',
    chain: 'ICON',
    protocol: 'Balance',
    apy: 'NEW ✨',
    totalAssets: '13,445,372',
    explored: true,
    image: BAINIcon,
  },
  {
    pool: 'bnUSD/BALN',
    chain: 'ICON',
    protocol: 'Balance',
    apy: 'NEW ✨',
    totalAssets: '3,410,552',
    explored: true,
    image: DollarIcon,

    about:
      'Curve is an exchange liquidity pool on Ethereum designed for: extremely efficient stablecoin trading, low risk, supplemental fee income for liquidity providers, without an opportunity cost.',
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
  },
  {
    pool: 'CFT/ICX',
    chain: 'ICON',
    protocol: '-',
    apy: '27.04%',
    totalAssets: '2,334,109',
    image: CFTIcon,
  },
  {
    pool: 'FIN/ETH',
    chain: 'ICON',
    protocol: 'Yearn',
    apy: '7.24%',
    totalAssets: '2,144,469',
    image: FINIcon,
  },
];

const highlightApyData = [
  {
    pool: 'BaIn/sICX',
    apy: '27.04%',
    image: BAINIcon,
  },
  {
    pool: 'ETH/sICX',
    apy: '18.43%',
    image: ETHIcon,
  },
  {
    pool: 'BTC/sICX',
    apy: '12.07%',
    image: BTCIcon,
  },
];

export { opportunitiesAssets, highlightApyData };
