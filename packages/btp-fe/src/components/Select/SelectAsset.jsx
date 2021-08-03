import styled from 'styled-components';

import { Text } from 'components/Typography';
import { Icon } from 'components/Icon';
import { TextWithIcon } from 'components/TextWithIcon';
import { colors } from 'components/Styles/Colors';
import Select from './Select';

import { wallets } from 'utils/constants';

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 160px;

  & .icon {
    margin-right: 12px;
  }

  .plain-text.xs {
    color: ${colors.grayScaleSubText};
    margin-top: 4px;
  }
`;

const Item = ({ icon, symbol, children }) => {
  return (
    <StyledItem>
      <Icon icon={icon} width="24px" />
      <div className="info">
        <Text className="md">{symbol}</Text>
        <Text className="xs">{children}</Text>
      </div>
    </StyledItem>
  );
};

const SelectAsset = ({ onChange }) => {
  /* eslint-disable react/display-name */
  const coins = [
    {
      value: 'ICX',
      label: 'ICX',
      renderLabel: () => (
        <TextWithIcon icon={wallets.iconex} width="24px">
          ICX
        </TextWithIcon>
      ),
      renderItem: () => (
        <Item icon={wallets.iconex} symbol="ICX">
          ICON
        </Item>
      ),
    },
    {
      value: 'ETH',
      label: 'ETH',
      renderLabel: () => <TextWithIcon icon="ETH">ETH</TextWithIcon>,
      renderItem: () => (
        <Item icon="ETH" symbol="ETH">
          Ethereum
        </Item>
      ),
    },
  ];

  return <Select options={coins} onChange={onChange} name="token" />;
};
export default SelectAsset;
