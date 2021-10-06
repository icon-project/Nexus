import styled from 'styled-components/macro';
import { CheckOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

import { Text } from '../Typography';
import { Loader } from '../Loader';

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
  .wallet-img {
    img {
      width: inherit;
    }
  }

  ${media.md`
    width: 100%;
  `};
`;

export const WalletSelector = ({
  wallet,
  type,
  active,
  onClick,
  isInstalled,
  isCheckingInstalled,
}) => {
  return (
    <StyledWalletItem
      className="wallet-selector"
      autoFocus={active}
      onClick={isCheckingInstalled ? () => {} : onClick}
    >
      <Avatar className="wallet-img" src={wallet[type].icon} size={32} />
      <Text className="md wallet-title">
        {!isInstalled && !isCheckingInstalled && 'Install '}
        {wallet[type].title}
      </Text>
      {isCheckingInstalled && <Loader size="25px" borderSize="3px" />}
      {active && <CheckOutlined />}
    </StyledWalletItem>
  );
};
