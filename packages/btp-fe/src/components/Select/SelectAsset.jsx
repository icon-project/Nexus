import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Icon } from 'components/Icon';
import { TextWithIcon } from 'components/TextWithIcon';
import { colors } from 'components/Styles/Colors';
import Select from './Select';

import { tokenOptionList } from 'utils/constants';

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

const SelectAsset = ({ onChange }) => {
  /* eslint-disable react/display-name */
  const coins = tokenOptionList.map(({ symbol, netWorkLabel }) => ({
    value: symbol,
    label: symbol,
    renderLabel: () => (
      <TextWithIcon icon={symbol} width="24px">
        {symbol}
      </TextWithIcon>
    ),
    renderItem: () => (
      <Item icon={symbol} symbol={symbol}>
        {netWorkLabel}
      </Item>
    ),
  }));

  return <Select options={coins} onChange={onChange} name="token" />;
};
export default SelectAsset;
