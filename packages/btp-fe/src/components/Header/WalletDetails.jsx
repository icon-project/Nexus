import { useState } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Avatar } from 'antd';

import { useTokenToUsd } from 'hooks/useTokenToUsd';
import { useTokenBalance } from 'hooks/useTokenBalance';
import { toSeparatedNumberString } from 'utils/app';
import { tokenOptionList } from 'utils/constants';

import { Select } from 'components/Select';
import { Text, Header } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
// import { SubTitleMixin } from 'components/Typography/SubTitle';
import { media } from 'components/Styles/Media';
import { PrimaryButton, SecondaryButton } from 'components/Button';

import copyIcon from 'assets/images/copy-icon.svg';

const { tertiaryBase, grayScaleSubText } = colors;

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

  > .wallet-balance {
    margin: 32px 0 21px;

    .header-text {
      display: flex;
      align-items: center;
    }
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
  }

  ${media.md`
    width: 100%;
    overflow: auto;

    .control-buttons {
      > .disconnect-btn {
        margin-right: 10px;
      }
    }
    
  `}
`;

const TokenSelector = styled(Select)`
  border: solid 1px ${grayScaleSubText};
  padding: 0 5px;
  margin-left: 4px;
  background-color: transparent !important;

  &::after {
    width: 9.33px;
    margin-left: 11.67px;
  }

  > ul {
    top: calc(100% - 5px);
    width: 120px;
  }
`;

export const WalletDetails = ({
  networkName,
  userAvatar,
  // balance,
  unit,
  address,
  shortedAddress,
  onDisconnectWallet,
  onSwitchWallet,
}) => {
  const [selectedToken, setSelectedToken] = useState(unit);
  const [currentBalance, currentSymbol] = useTokenBalance(selectedToken);
  const usdBalance = useTokenToUsd(currentSymbol, currentBalance);

  const tokens = [
    { label: unit, value: unit },
    ...tokenOptionList
      .map(({ symbol }) => ({ label: symbol, value: symbol }))
      .filter((item) => item.label !== unit),
  ];

  const onTokenChange = async (evt) => {
    setSelectedToken(evt.target.value);
  };

  return (
    <Wrapper>
      <Text className="md network-name">{networkName}</Text>
      <Avatar className="user-avatar" src={userAvatar} size={120} />
      <div className="wallet-balance">
        <Text className="md dark-text">Balance</Text>
        <div className="right">
          <Header className="sm bold">
            {currentBalance}
            <TokenSelector options={tokens} onChange={onTokenChange} name="tokens" />
          </Header>

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
            <div>
              <Text className="xs bold copy-address">
                <img src={copyIcon} alt="icon" />
                Copy address
              </Text>
            </div>
          </CopyToClipboard>
        </div>
      </div>
      <div className="control-buttons">
        <SecondaryButton
          width={192}
          height={64}
          onClick={onDisconnectWallet}
          className="disconnect-btn"
        >
          Disconnect wallet
        </SecondaryButton>
        <PrimaryButton width={192} height={64} onClick={onSwitchWallet}>
          Switch wallet
        </PrimaryButton>
      </div>
    </Wrapper>
  );
};
