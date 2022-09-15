import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Icon } from 'components/Icon';
import { colors } from 'components/Styles';
import Select from './Select';

import { chainConfigs, getTokenList, getCustomizedChainList } from 'connectors/chainConfigs';

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  min-width: ${({ $width }) => ($width ? $width : '160px')};
  text-align: left;

  & .icon {
    margin-right: 12px;
  }

  .plain-text.xs {
    color: ${colors.grayScaleSubText};
    margin-top: 4px;
  }
`;

const Item = ({ symbol, children, width, ...props }) => {
  return (
    <StyledItem $width={width}>
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
    const options = [...getCustomizedChainList(), ...getTokenList()].map(
      ({ CHAIN_NAME, COIN_SYMBOL, symbol, chain, ...others }) => {
        const tokenSymbol = COIN_SYMBOL || symbol;
        return {
          value: tokenSymbol,
          label: tokenSymbol,
          renderLabel: () => (
            <Item icon={tokenSymbol} symbol={tokenSymbol} width="100px">
              {CHAIN_NAME || chain}
            </Item>
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

  return (
    <Select
      options={getOptions()}
      onChange={onChange}
      name="token"
      id="assest-selector"
      maxHeight="180px"
    />
  );
};

export default SelectAsset;
