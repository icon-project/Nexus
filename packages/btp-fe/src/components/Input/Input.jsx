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
`;

export const Input = (props) => {
  return <StyledInput {...props} />;
};
