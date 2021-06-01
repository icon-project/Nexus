import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Form } from 'react-final-form';

import { Details } from './Details';
import { Approval } from './Approval';
import { TransferCard } from '../TransferCard';

import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

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
  const [wasBack, setWasBack] = useState(false);
  const [tokenValue, setTokenValue] = useState('');

  useEffect(() => {
    if (step !== 0) setWasBack(true);
  }, [step]);

  const memoizedSetStep = useCallback((param) => setStep(param), [setStep]);
  const memoizedSetTokenValue = useCallback((param) => setTokenValue(param), [setTokenValue]);

  const onSubmit = (values) => {
    console.log('🚀 ~ file: TransferBox.jsx ~ line 29 ~ onSubmit ~ values', values);
  };

  const isCurrentStep = (s) => s === step;

  return (
    <Wrapper>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, values }) => {
          const { tokenAmount, recipient } = values;
          return (
            <form onSubmit={handleSubmit}>
              <div className={`container ${isCurrentStep(0) && 'active'}`}>
                <TransferCard setStep={memoizedSetStep} />
              </div>
              <div className={`container ${isCurrentStep(1) && 'active'}`}>
                <Details
                  setStep={memoizedSetStep}
                  tokenValue={tokenValue}
                  setTokenValue={memoizedSetTokenValue}
                  initalInputDisplay={!wasBack}
                />
              </div>
              <div className={`container ${isCurrentStep(2) && 'active'}`}>
                <Approval
                  setStep={memoizedSetStep}
                  tokenValue={tokenAmount}
                  recipient={recipient}
                />
              </div>
            </form>
          );
        }}
      />
    </Wrapper>
  );
};
