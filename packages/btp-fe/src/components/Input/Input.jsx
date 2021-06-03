import React from 'react';
import styled from 'styled-components/macro';
import { colors } from '../Styles/Colors';

const StyledInput = styled.input`
  width: 100%;

  color: ${colors.grayText};
  caret-color: ${colors.tertiaryDark};
  border: 0;

  &:focus {
    outline: none;
  }

  & ~ p.err-msg {
    color: ${colors.errorState};
    margin-top: 7px;
  }
`;

export const Input = React.forwardRef((props, ref) => {
  return <StyledInput {...props} ref={ref} />;
});

Input.displayName = 'Input';
