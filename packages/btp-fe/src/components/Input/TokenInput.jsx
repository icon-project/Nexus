import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';

import { Input } from './Input';
import { Text } from '../Typography';
import { mediumBoldHeader } from '../Typography/Header';

import { colors } from '../Styles/Colors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  position: relative;

  .exchange {
    text-align: center;
  }

  .token-label {
    ${mediumBoldHeader}
    background-color: ${colors.grayBG};
    word-break: break-word;
    margin: 0 32px;
    padding: 0 10px;
    display: none;
    position: absolute;
    top: 0;

    &.active {
      display: block;
    }
  }
`;

const StyledTokenInput = styled(Input)`
  ${mediumBoldHeader}
  width: 105px;
  background-color: transparent;
  width: 100%;
  padding: 0 32px;
  text-align: center;

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

export const TokenInput = ({
  initalInputDisplay,
  isCurrent,
  value,
  onBlur,
  meta = {},
  ...props
}) => {
  const [showInput, setShowInput] = useState(initalInputDisplay === false ? false : true);
  const tokenInputRef = useRef();

  useEffect(() => {
    if (isCurrent) tokenInputRef.current.focus();
  }, [isCurrent]);

  const toggleInput = () => {
    setShowInput(!showInput);
  };
  return (
    <Wrapper>
      <StyledTokenInput
        {...props}
        value={value}
        type="number"
        onBlur={(e) => {
          onBlur(e);
          toggleInput();
        }}
        ref={tokenInputRef}
      />

      <div
        className={`token-label ${!showInput && 'active'}`}
        onClick={() => {
          toggleInput();
          tokenInputRef.current.focus();
        }}
      >
        {value || 0} ICX
      </div>

      <Text className="medium exchange">= $0.00 USD</Text>
      {meta.error && meta.touched && <Text className="x-small err-msg">{meta.error}</Text>}
    </Wrapper>
  );
};
