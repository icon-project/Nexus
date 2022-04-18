import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Icon } from 'components/Icon';
import { TextWithIcon } from 'components/TextWithIcon';
import { colors } from 'components/Styles/Colors';
import Select from './Select';

import { chainList } from 'connectors/chainConfigs';

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

const Item = ({ symbol, children, ...props }) => {
  return (
    <StyledItem>
      <Icon {...props} width="24px" />
      <div className="info">
        <Text className="md">{symbol}</Text>
        <Text className="xs">{children}</Text>
      </div>
    </StyledItem>
  );
};

const SelectAsset = ({ onChange, nativeCoin }) => {
  /* eslint-disable react/display-name */
  const options = chainList
    .filter(({ COIN_SYMBOL }) => COIN_SYMBOL === nativeCoin)
    .map(({ CHAIN_NAME, COIN_SYMBOL }) => ({
      value: COIN_SYMBOL,
      label: COIN_SYMBOL,
      renderLabel: () => (
        <TextWithIcon icon={COIN_SYMBOL} width="24px">
          {COIN_SYMBOL}
        </TextWithIcon>
      ),
      renderItem: () => (
        <Item icon={COIN_SYMBOL} symbol={COIN_SYMBOL}>
          {CHAIN_NAME}
        </Item>
      ),
    }));

  return <Select options={options} onChange={onChange} name="token" />;
};

export default SelectAsset;
