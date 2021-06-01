import styled from 'styled-components/macro';
import { Input } from './Input';
import { colors } from '../Styles/Colors';
import { mediumText } from '../Typography/Text';

export const StyledTextInput = styled(Input)`
  ${mediumText};

  padding: 20px 16px;
  background-color: ${colors.grayDark};
  border-radius: 4px;
  border: solid 1px ${({ isError }) => (isError ? colors.errorState : colors.grayLine)};

  &:focus {
    border-color: ${colors.primaryBrand};
    background-color: ${colors.grayAccent};
  }
`;

export const TextInput = ({ children, meta = {}, ...props }) => {
  const isError = meta.error && meta.touched;

  return (
    <StyledTextInput {...props} isError={isError}>
      {children}
    </StyledTextInput>
  );
};
