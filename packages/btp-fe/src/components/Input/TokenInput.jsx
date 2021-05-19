import { useState } from 'react';
import styled from 'styled-components/macro';
import { Input } from './Input';
import { Text } from '../Typography';
import { mediumBoldHeader } from '../Typography/Header';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .exchange {
    text-align: center;
  }

  .token-label {
    ${mediumBoldHeader}
  }
`;

const StyledTokenInput = styled(Input)`
  ${mediumBoldHeader}
  width: 105px;
  background-color: transparent;

  /* remove number arrows */
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const TokenInput = ({ value, setTokenValue, initalInputDisplay, ...props }) => {
  const [showInput, setShowInput] = useState(initalInputDisplay === false ? false : true);

  const toggleInput = () => {
    setShowInput(!showInput);
  };
  return (
    <Wrapper>
      {showInput ? (
        <StyledTokenInput
          {...props}
          type="number"
          onBlur={toggleInput}
          onChange={(evt) => setTokenValue(evt.target.value)}
          value={value}
          autoFocus
        />
      ) : (
        <div className="token-label" onClick={toggleInput}>
          {value || 0} ETH
        </div>
      )}

      <Text className="medium exchange">= $0.00 USD</Text>
    </Wrapper>
  );
};
