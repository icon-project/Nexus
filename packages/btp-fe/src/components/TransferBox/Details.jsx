import { memo } from 'react';
import styled from 'styled-components/macro';
import { TokenInput, TextInput } from '../Input';
import { Icon } from '../Icon/Icon';
import { Header, Text } from '../Typography';
import { colors } from '../Styles/Colors';

import { ControlButtons } from './ControlButtons';

const Wrapper = styled.div`
  .heading {
    text-align: center;
    margin-bottom: 28px;
  }

  .content {
    margin-top: 10px;
    padding: 0 32px;

    .label {
      margin: 27px 0 7px;
    }
  }
`;

const WalletBalance = styled.div`
  width: 100%;
  height: 64px;

  border: solid 1px ${colors.grayLine};
  border-radius: 4px;

  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 32px;

  .left {
    display: flex;
    align-items: center;

    .wallet-name {
      margin-left: 13.17px;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
`;

const Addresses = styled.div`
  padding: 18px 32px;
  border-top: solid 1px ${colors.grayLine};
  border-bottom: solid 1px ${colors.grayLine};

  .send {
    margin-bottom: 12px;
  }

  .send,
  .to {
    display: flex;
    justify-content: space-between;

    .subtitle {
      color: ${colors.graySubText};
    }

    .sender {
      display: flex;
      align-items: center;

      .sender--name {
        margin-left: 8px;
      }
    }
  }
`;

export const Details = memo(({ setStep, tokenValue, setTokenValue, initalInputDisplay }) => {
  return (
    <Wrapper>
      <Header className="small bold heading">Transfer</Header>
      <TokenInput
        placeholder="0 ETH"
        value={tokenValue}
        setTokenValue={setTokenValue}
        initalInputDisplay={initalInputDisplay}
      />

      <div className="content">
        <Text className="small label">Recipient</Text>
        <TextInput placeholder="Enter a ETH address" />
        <Text className="small label">Wallet balance</Text>
        <WalletBalance>
          <div className="left">
            <Icon />
            <Text className="medium wallet-name">Metamask</Text>
          </div>
          <div className="right">
            <Text className="medium">3,53869714 ETH</Text>
            <Text className="x-small">= $956.74</Text>
          </div>
        </WalletBalance>
      </div>

      <Addresses>
        <div className="send">
          <Text className="medium subtitle">Send</Text>
          <div className="sender">
            <Icon icon="eth" size="s" />
            <Text className="medium sender--name">ETH (Etherum mainnet)</Text>
          </div>
        </div>
        <div className="to">
          <Text className="medium subtitle">To</Text>
          <Text className="medium">Binance Smart Chain</Text>
        </div>
      </Addresses>
      <ControlButtons onExecute={() => setStep(2)} onBack={() => setStep(0)} />
    </Wrapper>
  );
});

Details.displayName = 'Details';
