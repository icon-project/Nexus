import styled from 'styled-components';
import { CheckOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

import { Text } from '../Typography';

import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

const { grayText, successState, grayAccent } = colors;

const StyledWalletItem = styled.button`
  margin: 0 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  width: 416px;
  height: 72px;
  padding: 0 28.5px;
  background: transparent;
  color: ${grayText};

  .wallet-title {
    margin-right: auto;
    margin-left: 13.3px;
  }
  span {
    grid-column: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 18px;
    color: ${successState};
  }
  &:hover,
  :focus {
    background: ${grayAccent};
    border-radius: 4px;
  }

  ${media.md`
    width: 100%;
  `};
`;

export const WalletSelector = ({ wallet, type, active, onClick, isInstalled }) => {
  return (
    <StyledWalletItem className="wallet-selector" autoFocus={active} onClick={onClick}>
      <Avatar src={wallet[type].icon} size={30} />
      <Text className="medium wallet-title">
        {!isInstalled && 'Install '}
        {wallet[type].title}
      </Text>
      {active && <CheckOutlined />}
    </StyledWalletItem>
  );
};
