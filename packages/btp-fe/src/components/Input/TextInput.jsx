import styled from 'styled-components/macro';
import { Input } from './Input';
import { colors } from '../Styles/Colors';
import { mediumText, Text } from 'components/Typography/Text';

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

  // Removing input background colour for Chrome autocomplete
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: ${colors.grayText};
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export const TextInput = ({ children, meta = {}, ...props }) => {
  const isError = meta.error && meta.touched;

  return (
    <>
      <StyledTextInput {...props} isError={isError}>
        {children}
      </StyledTextInput>
      {meta.error && meta.touched && <Text className="x-small err-msg">{meta.error}</Text>}
    </>
  );
};
