import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/macro';

import { Details } from './Details';
import { Approval } from './Approval';
import { colors } from '../Styles/Colors';

const Wrapper = styled.div`
  width: 480px;
  background-color: ${colors.grayBG};

  padding: 23px 0 0;
`;

export const TransferBox = () => {
  const [step, setStep] = useState(1);
  const [wasBack, setWasBack] = useState(false);
  const [tokenValue, setTokenValue] = useState('');

  useEffect(() => {
    setWasBack(true);
  }, [step]);

  const memoizedSetStep = useCallback((param) => setStep(param), [setStep]);
  const memoizedSetTokenValue = useCallback((param) => setTokenValue(param), [setTokenValue]);

  const steps = {
    1: (
      <Details
        setStep={memoizedSetStep}
        tokenValue={tokenValue}
        setTokenValue={memoizedSetTokenValue}
        initalInputDisplay={!wasBack}
      />
    ),
    2: <Approval setStep={memoizedSetStep} tokenValue={tokenValue} />,
  };

  return <Wrapper>{steps[step]}</Wrapper>;
};
