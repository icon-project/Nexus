import { useState } from 'react';
import styled from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Avatar } from 'antd';

import { useTokenToUsd } from 'hooks/useTokenToUsd';
import { useTokenBalance } from 'hooks/useTokenBalance';
import { toSeparatedNumberString } from 'utils/app';
import { tokenOptionList } from 'utils/constants';

import { Select } from 'components/Select';
import { Text, Header } from 'components/Typography';
import { TextMixin } from 'components/Typography/Text';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { PrimaryButton, SecondaryButton } from 'components/Button';

import { getService } from 'services/transfer';

import copyIcon from 'assets/images/copy-icon.svg';
import refundIcon from 'assets/images/refund-icon.svg';

const { tertiaryBase, grayScaleSubText, grayLine } = colors;

const Wrapper = styled.div`
  max-height: 80vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  .network-name {
    margin-bottom: 42px;
  }

  .dark-text {
    color: ${grayScaleSubText};
  }

  .user-avatar {
    display: inline-flex;
    margin-bottom: 14px;
  }

  .wallet-balance {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 72px;
    margin-bottom: 4px;
  }

  .sub-title {
    display: flex;
    justify-content: start;
    margin: 21px 0 7px;
  }

  .box-container {
    width: 100%;
    border: solid 1px ${grayLine};
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 27px;

    .select-refund {
      display: flex;
      align-items: center;
    }

    .padding-content {
      padding: 10px 0 10px 16px;
    }

    img {
      margin-right: 8.83px;
      vertical-align: middle;
    }
  }

  .control-buttons {
    margin-top: 27px;
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
  border: solid 1px ${grayLine};
  padding: 4px 8px;
  margin-left: 10px;
  display: inline-flex;
  height: 32px;
  min-width: 73px;

  > .md {
    ${TextMixin.bold};
  }

  &::after {
    width: 9.33px;
    margin-left: 11.67px;
  }

  > ul {
    top: calc(100% - 5px);
    width: 110px;
  }
`;

const RefundSelector = styled(Select)`
  padding: 0px 0px;
  background-color: transparent !important;
  display: inline-flex;
  border-right: solid 1px ${grayLine};
  border-radius: 0px;
  margin-right: 11.67px;

  &::after {
    width: 9.33px;
    margin: 0 11.67px;
  }

  > .md {
    width: 33px;
  }

  > ul {
    width: 114px;

    ${media.md`
      width: 83px;
    `};
  }
`;

const ActionBtn = styled.button`
  ${TextMixin.xsBold};
  padding: 10px 16px 10px 0;
  color: ${tertiaryBase};
  background-color: transparent;
  cursor: pointer;

  &:active {
    color: #5093ab;
  }
`;

export const WalletDetails = ({
  networkName,
  userAvatar,
  unit,
  address,
  shortedAddress,
  onDisconnectWallet,
  onSwitchWallet,
}) => {
  const [selectedToken, setSelectedToken] = useState(unit);
  const [selectedRefundToken, setSelectedRefundToken] = useState(unit);
  const [refund, setRefund] = useState(0);
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

  const onChangeRefundSelect = async (e) => {
    const { value } = e.target;
    setSelectedRefundToken(value);
    getService()
      .getBalanceOf({
        address,
        refundable: true,
        symbol: value,
      })
      .then((refund) => {
        setRefund(refund);
      });
  };

  return (
    <Wrapper>
      <Text className="md network-name">{networkName}</Text>
      <Avatar className="user-avatar" src={userAvatar} size={120} />
      <Header className="md bold wallet-balance">
        {toSeparatedNumberString(currentBalance)}
        <TokenSelector options={tokens} onChange={onTokenChange} name="tokens" />
      </Header>

      <Text className="md dark-text">= ${toSeparatedNumberString(usdBalance)}</Text>
      <Text className="sm sub-title">Refunds</Text>
      <div className="box-container">
        <div className="select-refund">
          <RefundSelector
            className="padding-content"
            options={tokens}
            onChange={onChangeRefundSelect}
          />
          <Text className="md">{refund}</Text>
        </div>

        <ActionBtn
          onClick={() => {
            if (refund > 0)
              getService().reclaim({
                coinName: selectedRefundToken,
                value: refund,
              });
          }}
        >
          <img src={refundIcon} alt="refund-icon" />
          Receive
        </ActionBtn>
      </div>
      <Text className="sm sub-title">Wallet Address</Text>
      <div className="box-container">
        <Text title={address} className="md padding-content">
          {shortedAddress}
        </Text>
        <CopyToClipboard text={address}>
          <ActionBtn>
            <img src={copyIcon} alt="icon" />
            Copy address
          </ActionBtn>
        </CopyToClipboard>
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
