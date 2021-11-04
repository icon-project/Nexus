import { useState, useCallback } from 'react';
import styled from 'styled-components/macro';
import { Form } from 'react-final-form';

import { Details } from './Details';
import { Approval } from './Approval';
import { TransferCard } from 'components/TransferCard';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { useTokenToUsd } from 'hooks/useTokenToUsd';
import { useSelect } from 'hooks/useRematch';

const Wrapper = styled.div`
  width: 480px;
  background-color: ${colors.grayBG};
  text-align: initial;
  overflow: hidden;
  border-radius: 4px;

  .container {
    display: none;

    &.active {
      display: block;
    }
  }

  ${media.md`
    width: 100%;
  `}
`;

export const TransferBox = () => {
  const [step, setStep] = useState(0);
  const [tokenValue, setTokenValue] = useState('');
  const [sendingInfo, setSendingInfo] = useState({ token: '', network: '' });

  const { isConnected, account } = useSelect(
    ({ account: { selectIsConnected, selectAccountInfo } }) => ({
      isConnected: selectIsConnected,
      account: selectAccountInfo,
    }),
  );

  const isCurrentStep = (s) => s === step;

  const { unit, currentNetwork } = account;
  const usdRate = useTokenToUsd(unit, 1, isCurrentStep(1));

  const onSendingInfoChange = (info = {}) => {
    setSendingInfo((sendingInfo) => ({ ...sendingInfo, ...info }));
  };

  const memoizedSetStep = useCallback((param) => setStep(param), [setStep]);
  const memoizedSetTokenValue = useCallback((param) => setTokenValue(param), [setTokenValue]);
  const onSubmit = () => {};

  return (
    <Wrapper>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, values, valid, form }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className={`container ${isCurrentStep(0) && 'active'}`}>
                <TransferCard
                  setStep={memoizedSetStep}
                  setSendingInfo={onSendingInfoChange}
                  isConnected={isConnected}
                  isSendingNativeCoin={unit === sendingInfo.token}
                  currentNetwork={currentNetwork}
                />
              </div>
              <div className={`container ${isCurrentStep(1) && 'active'}`}>
                <Details
                  isCurrent={isCurrentStep(1)}
                  setStep={memoizedSetStep}
                  tokenValue={tokenValue}
                  usdRate={usdRate}
                  setTokenValue={memoizedSetTokenValue}
                  isValidForm={valid}
                  sendingInfo={sendingInfo}
                  account={account}
                  form={form}
                />
              </div>
              <div className={`container ${isCurrentStep(2) && 'active'}`}>
                <Approval
                  isCurrent={isCurrentStep(2)}
                  setStep={memoizedSetStep}
                  values={values}
                  sendingInfo={sendingInfo}
                  account={account}
                  form={form}
                  usdRate={usdRate}
                />
              </div>
            </form>
          );
        }}
      />
    </Wrapper>
  );
};
