import styled from 'styled-components/macro';
import { Input } from './Input';
import { colors } from '../Styles/Colors';
import { TextMixin, Text } from 'components/Typography/Text';

export const StyledTextInput = styled(Input)`
  ${TextMixin.md};

  padding: 20px 16px;
  background-color: ${colors.grayDark};
  border-radius: 4px;
  border: solid 1px ${({ hasError }) => (hasError ? colors.errorState : colors.grayLine)};

  &:focus {
    border-color: ${colors.primaryBrand};
    background-color: ${colors.grayAccent};
  }

  // Removing input background colour for Chrome autocomplete
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: ${colors.grayText};
    -webkit-box-shadow: 0 0 0 50px ${colors.grayDark} inset;
  }

  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 50px ${colors.grayAccent} inset;
  }
`;

export const TextInput = ({ children, meta = {}, ...props }) => {
  const hasError = meta.error && meta.touched;

  return (
    <>
      <StyledTextInput {...props} hasError={hasError}>
        {children}
      </StyledTextInput>
      {hasError && <Text className="xs err-msg">{meta.error}</Text>}
    </>
  );
};
