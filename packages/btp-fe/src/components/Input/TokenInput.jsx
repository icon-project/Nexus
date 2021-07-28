import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';

import { useTokenToUsd } from '../../hooks/useTokenToUsd';

import { Input } from './Input';
import { Text } from '../Typography';
import { HeaderMixin } from 'components/Typography/Header';

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
    ${HeaderMixin.mdBold}
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
  ${HeaderMixin.mdBold}
  width: 105px;
  background-color: transparent;
  width: 100%;
  padding: 0 32px;
  text-align: center;
`;

export const TokenInput = ({ isCurrent, value, token, onBlur = () => {}, meta = {}, ...props }) => {
  const [showInput, setShowInput] = useState(true);
  const tokenInputRef = useRef();
  const usdBalance = useTokenToUsd(token, value);

  useEffect(() => {
    if (isCurrent) {
      tokenInputRef.current.focus();
      setShowInput(true);
    }
  }, [isCurrent, setShowInput]);

  return (
    <Wrapper>
      <StyledTokenInput
        {...props}
        value={value}
        min={0}
        type="number"
        onBlur={(e) => {
          onBlur(e);
          setShowInput(false);
        }}
        ref={tokenInputRef}
      />

      <div
        className={`token-label ${!showInput && 'active'}`}
        onClick={() => {
          setShowInput(true);
          tokenInputRef.current.focus();
        }}
      >
        {value || 0} {token}
      </div>
      <Text className="medium exchange">= ${usdBalance.toLocaleString()}</Text>
      {meta.error && meta.touched && <Text className="x-small err-msg">{meta.error}</Text>}
    </Wrapper>
  );
};
