import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Avatar } from 'antd';

import { Text } from '../Typography';
import { colors } from '../Styles/Colors';
import { mediumBoldSubtitle } from '../Typography/SubTitle';
import { mediumText, smallText } from '../Typography/Text';

import copyIcon from '../../assets/images/copy-icon.svg';

const { primaryBrandLight, primaryBrandBase, tertiaryBase, grayScaleSubText } = colors;

const Wrapper = styled.div`
  button {
    width: auto;
    height: auto;
    background-color: transparent;
  }
  .network-name {
    margin-bottom: 42px;
  }
  h4 {
    display: grid;
    grid-template-columns: 20% 60% 20%;
    margin-bottom: 10px;
    span {
      grid-column: 2;
      text-align: center;
    }
    button {
      grid-column: 3;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 18px;
      margin: 0;
    }
  }
  .wallet-balance {
    width: 100%;
    height: 60px;

    display: grid;
    grid-template: 50% 50% / 50% 50%;
    place-items: center;

    margin-top: 20px;
    margin-bottom: 20px;

    span:first-of-type {
      ${mediumText};

      justify-self: start;
      color: ${grayScaleSubText};
    }

    span {
      justify-self: end;
      font-weight: 600;
      font-size: 25px;
      line-height: 36px;

      text-align: right;
      letter-spacing: 1px;
    }

    span:last-of-type {
      ${smallText}
      color: ${grayScaleSubText};

      grid-column: 2/3;
      grid-row: 2/3;
    }
  }

  .wallet-address {
    width: 100%;
    display: grid;
    grid-template: 50% 50% / 50% 50%;
    place-items: center;
    margin-bottom: 20px;

    span:first-of-type {
      ${mediumText};
      justify-self: start;
      color: ${grayScaleSubText};
    }
    span {
      justify-self: end;
    }
    .copy-address {
      cursor: pointer;
      grid-column: 2/3;
      grid-row: 2/3;
      color: ${tertiaryBase};

      text-align: center;
      justify-self: end;

      &:active {
        color: #4e8da2;
      }
      img {
        margin-right: 4.67px;
      }
    }
  }
  .nav-button {
    margin-top: auto;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;

    button:first-of-type {
      color: ${primaryBrandLight};
      width: 192px;
      height: 64px;
      border-radius: 4px;
      border: solid 1px ${primaryBrandLight};
      background-color: transparent;
    }
    button {
      ${mediumBoldSubtitle};
      text-align: center;
      width: 192px;
      height: 64px;
      border-radius: 4px;
      background-color: ${primaryBrandBase};
    }
  }
`;

export const WalletDetails = ({
  networkName,
  userAvatar,
  balance,
  unit,
  address,
  shortedAddress,
  onDisconnectWallet,
  onSwitchWallet,
}) => {
  return (
    <Wrapper>
      <Text className="medium network-name">{networkName}</Text>
      <Avatar className="user-avatar" src={userAvatar} size={120} />
      <div className="wallet-balance">
        <span>Balance</span>
        <span>{`${balance} ${unit}`}</span>
        <span> = $98.22 USD</span>
      </div>
      <div className="wallet-address">
        <span>Wallet Address</span>
        <span title={address}>{shortedAddress}</span>
        <CopyToClipboard text={address}>
          <Text className="x-small bold copy-address">
            <img src={copyIcon} />
            Copy address
          </Text>
        </CopyToClipboard>
      </div>
      <div className="nav-button">
        <button onClick={onDisconnectWallet}>Disconnect wallet</button>
        <button onClick={onSwitchWallet}>Switch wallet</button>
      </div>
    </Wrapper>
  );
};
