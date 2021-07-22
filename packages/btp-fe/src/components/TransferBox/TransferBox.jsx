import { useState, useCallback } from 'react';
import styled from 'styled-components/macro';
import { Form } from 'react-final-form';

import { Details } from './Details';
import { Approval } from './Approval';
import { TransferCard } from '../TransferCard';

import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

import { useSelect } from 'hooks/useRematch';

const Wrapper = styled.div`
  width: 480px;
  background-color: ${colors.grayBG};
  padding: 23px 0 0;

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

  const onSendingInfoChange = (info = {}) => {
    setSendingInfo((sendingInfo) => ({ ...sendingInfo, ...info }));
  };

  const memoizedSetStep = useCallback((param) => setStep(param), [setStep]);
  const memoizedSetTokenValue = useCallback((param) => setTokenValue(param), [setTokenValue]);

  const onSubmit = () => {};

  const isCurrentStep = (s) => s === step;

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
                />
              </div>
              <div className={`container ${isCurrentStep(1) && 'active'}`}>
                <Details
                  isCurrent={isCurrentStep(1)}
                  setStep={memoizedSetStep}
                  tokenValue={tokenValue}
                  setTokenValue={memoizedSetTokenValue}
                  isValidForm={valid}
                  sendingInfo={sendingInfo}
                  account={account}
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
                />
              </div>
            </form>
          );
        }}
      />
    </Wrapper>
  );
};
