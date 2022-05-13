import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Icon } from 'components/Icon';
import { TextWithIcon } from 'components/TextWithIcon';
import { colors } from 'components/Styles/Colors';
import Select from './Select';

import { chainConfigs, chainList } from 'connectors/chainConfigs';

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

const SelectAsset = ({ onChange, nativeCoin, networkId }) => {
  /* eslint-disable react/display-name */
  const getOptions = () => {
    const options = chainList.map(({ CHAIN_NAME, COIN_SYMBOL, ...others }) => ({
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
      ...others,
    }));

    if (!nativeCoin || networkId === chainConfigs.ICON.id) {
      return options;
    }

    return options.filter(
      (option) => option.id === networkId || option.id === chainConfigs.ICON.id,
    );
  };

  return <Select options={getOptions()} onChange={onChange} name="token" />;
};

export default SelectAsset;
