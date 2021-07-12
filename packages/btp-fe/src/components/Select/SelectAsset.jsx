import styled from 'styled-components';
import { colors } from '../Styles/Colors';

import { Text } from 'components/Typography';
import { TextWithIcon } from 'components/TextWithIcon';
import Select from './Select';

import iconexIcon from 'assets/images/icon-ex.svg';

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 160px;

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

const SelectAsset = ({ onChange }) => {
  /* eslint-disable react/display-name */
  const coins = [
    {
      value: 'ICX',
      label: 'ICX',
      renderLabel: () => <TextWithIcon icon="iconex">ICX</TextWithIcon>,
      renderItem: () => (
        <Item icon={iconexIcon} symbol="ICX">
          ICON
        </Item>
      ),
    },
  ];

  return <Select options={coins} onChange={onChange} name="token" />;
};
export default SelectAsset;
