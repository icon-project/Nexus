import styled from 'styled-components';
import { colors } from '../Styles/Colors';

import { Text } from 'components/Typography';
import { TextWithIcon } from 'components/TextWithIcon';
import Select from './Select';

import BTCIconSrc from 'assets/images/btc-icon.svg';
import BCHIconSrc from 'assets/images/bch-icon.svg';
import ETHIconSrc from 'assets/images/eth-icon.svg';

const StyledItem = styled.div`
  display: flex;
  align-items: center;

  & > img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  p.x-small {
    color: ${colors.grayScaleSubText};
    margin-top: 4px;
  }
`;

const Item = ({ icon, symbol, children }) => {
  return (
    <StyledItem>
      <img src={icon} alt="icon" />
      <div className="info">
        <Text className="medium">{symbol}</Text>
        <Text className="x-small">{children}</Text>
      </div>
    </StyledItem>
  );
};

const SelectAsset = () => {
  /* eslint-disable react/display-name */
  const coins = [
    {
      value: 'BTC',
      label: 'Bitcoin',
      renderLabel: () => <TextWithIcon icon="btc">Bitcoin</TextWithIcon>,
      renderItem: () => (
        <Item icon={BTCIconSrc} symbol="BTC">
          Bitcoin
        </Item>
      ),
    },
    {
      value: 'BCH',
      label: 'Bitcoin cash',
      renderLabel: () => <TextWithIcon icon="bch">Bitcoin cash</TextWithIcon>,
      renderItem: () => (
        <Item icon={BCHIconSrc} symbol="BCH">
          Bitcoin cash
        </Item>
      ),
    },
    {
      value: 'ETH',
      label: 'Etherum',
      renderLabel: () => <TextWithIcon icon="eth">Etherum</TextWithIcon>,
      renderItem: () => (
        <Item icon={ETHIconSrc} symbol="ETH">
          Etherum
        </Item>
      ),
    },
  ];

  return <Select options={coins} />;
};
export default SelectAsset;
