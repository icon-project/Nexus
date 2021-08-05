import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Avatar } from 'antd';

import { useTokenToUsd } from 'hooks/useTokenToUsd';
import { toSeparatedNumberString } from 'utils/app';

import { Text, Header } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { media } from 'components/Styles/Media';

import copyIcon from 'assets/images/copy-icon.svg';

const { primaryBrandLight, primaryBrandBase, tertiaryBase, grayScaleSubText } = colors;

const Wrapper = styled.div`
  .network-name {
    margin-bottom: 42px;
  }

  .dark-text {
    color: ${grayScaleSubText};
    text-align: right;
  }

  .user-avatar {
    display: inline-flex;
  }

  .wallet-balance,
  .wallet-address {
    display: flex;
    justify-content: space-between;
    line-height: normal;
  }

  .wallet-balance {
    margin: 32px 0 21px;
  }

  .wallet-address {
    margin-bottom: 48px;

    .address {
      margin-bottom: 14px;
      display: inline-block;
    }

    .copy-address {
      color: ${tertiaryBase};
      cursor: pointer;

      &:active {
        color: #5093ab;
      }
    }

    img {
      margin-right: 4.67px;
      vertical-align: middle;
    }
  }

  .control-buttons {
    margin-top: auto;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;

    .btn {
      ${SubTitleMixin.mdBold};
      width: 192px;
      height: 64px;
      border-radius: 4px;
      text-align: center;
    }

    .btn__disconnect {
      color: ${primaryBrandLight};
      border: solid 1px ${primaryBrandLight};
      background-color: transparent;
    }

    .btn__switch-wallet {
      background-color: ${primaryBrandBase};
    }
  }

  ${media.md`
    .control-buttons {
      .btn {
        font-size: 12px;
        height: 50px;
        width: 45%;
      }
    }
    width: 100%;
    overflow: auto;
  `}
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
  const usdBalance = useTokenToUsd(unit, balance);
  return (
    <Wrapper>
      <Text className="md network-name">{networkName}</Text>
      <Avatar className="user-avatar" src={userAvatar} size={120} />
      <div className="wallet-balance">
        <Text className="md dark-text">Balance</Text>
        <div className="right">
          <Header className="sm bold">{`${balance} ${unit}`}</Header>

          <Text className="sm dark-text">= ${toSeparatedNumberString(usdBalance)}</Text>
        </div>
      </div>
      <div className="wallet-address">
        <Text className="md dark-text">Wallet Address</Text>
        <div className="right">
          <Text title={address} className="md address">
            {shortedAddress}
          </Text>
          <CopyToClipboard text={address}>
            <Text className="xs bold copy-address">
              <img src={copyIcon} alt="icon" />
              Copy address
            </Text>
          </CopyToClipboard>
        </div>
      </div>
      <div className="control-buttons">
        <button className="btn btn__disconnect" onClick={onDisconnectWallet}>
          Disconnect wallet
        </button>
        <button className="btn btn__switch-wallet" onClick={onSwitchWallet}>
          Switch wallet
        </button>
      </div>
    </Wrapper>
  );
};
