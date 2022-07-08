import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Icon } from 'components/Icon';
import { TextWithIcon } from 'components/TextWithIcon';
import { colors } from 'components/Styles/Colors';
import Select from './Select';

import { chainConfigs, chainList, getTokenList } from 'connectors/chainConfigs';

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
    const options = [...chainList, ...getTokenList()].map(
      ({ CHAIN_NAME, COIN_SYMBOL, symbol, chain, ...others }) => {
        const tokenSymbol = COIN_SYMBOL || symbol;
        return {
          value: tokenSymbol,
          label: tokenSymbol,
          renderLabel: () => (
            <TextWithIcon icon={tokenSymbol} width="24px">
              {tokenSymbol}
            </TextWithIcon>
          ),
          renderItem: () => (
            <Item icon={tokenSymbol} symbol={tokenSymbol}>
              {CHAIN_NAME || chain}
            </Item>
          ),
          ...others,
        };
      },
    );

    if (!nativeCoin || networkId === chainConfigs.ICON.id) {
      return options;
    }

    return options.filter(
      (option) =>
        option.id === networkId ||
        option.id === chainConfigs.ICON.id ||
        networkId === option.chainId,
    );
  };

  return <Select options={getOptions()} onChange={onChange} name="token" id="assest-selector" />;
};

export default SelectAsset;
