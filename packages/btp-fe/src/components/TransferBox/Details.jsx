import { memo } from 'react';
import styled from 'styled-components/macro';
import { Field } from 'react-final-form';

import { TokenInput, TextInput } from '../Input';
import { Icon } from '../Icon/Icon';
import { Header, Text } from '../Typography';
import { ControlButtons } from './ControlButtons';

import { composeValidators, maxValue } from 'utils/inputValidation';

import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

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
      text-transform: capitalize;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  ${media.md`
    padding: 16px;
    flex-direction: column;
    align-items: center;
    height: auto;

    .right {
      margin-top: 16px;
      align-items: center
    }
  `}
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

    .sender {
      display: flex;
      align-items: center;

      .sender--name {
        margin-left: 8px;
      }
    }
  }
`;

const required = (value) => (value ? undefined : 'Required');

export const Details = memo(
  ({
    setStep,
    setTokenValue,
    initalInputDisplay,
    isValidForm,
    isCurrent,
    sendingInfo,
    account,
    usdRate,
  }) => {
    const { token, network } = sendingInfo;
    const { balance, currentNetwork, wallet, unit } = account;

    const max = maxValue(balance, 'Insufficient balance');

    return (
      <Wrapper>
        <Header className="sm bold heading">Transfer</Header>
        <Field
          name="tokenAmount"
          validate={composeValidators(required, max)}
          render={({ input, meta }) => (
            <TokenInput
              placeholder={`0 ${token}`}
              setTokenValue={setTokenValue}
              initalInputDisplay={initalInputDisplay}
              isCurrent={isCurrent}
              token={token}
              usdRate={usdRate}
              {...input}
              meta={meta}
            />
          )}
        />

        <div className="content">
          <Text className="sm label">Recipient</Text>

          <Field
            name="recipient"
            validate={required}
            render={({ input, meta }) => (
              <TextInput placeholder={`Enter a ${network} address`} {...input} meta={meta} />
            )}
          />

          <Text className="sm label">Wallet balance</Text>
          <WalletBalance>
            <div className="left">
              <Icon icon={wallet} />
              <Text className="md wallet-name">{wallet}</Text>
            </div>
            <div className="right">
              <Text className="md">
                {balance.toLocaleString()} {unit}
              </Text>
              <Text className="xs" color={colors.graySubText}>
                = ${(usdRate * balance).toLocaleString()}
              </Text>
            </div>
          </WalletBalance>
        </div>

        <Addresses>
          <div className="send">
            <Text className="md" color={colors.graySubText}>
              Send
            </Text>
            <div className="sender">
              <Icon icon={token} size="s" />
              <Text className="md sender--name">
                {token} ({currentNetwork})
              </Text>
            </div>
          </div>
          <div className="to">
            <Text className="md" color={colors.graySubText}>
              To
            </Text>
            <Text className="md">{network}</Text>
          </div>
        </Addresses>
        <ControlButtons
          onExecute={() => {
            if (isValidForm) setStep(2);
          }}
          onBack={() => setStep(0)}
        />
      </Wrapper>
    );
  },
);

Details.displayName = 'Details';
