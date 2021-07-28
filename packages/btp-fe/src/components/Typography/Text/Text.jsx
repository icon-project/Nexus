import styled from 'styled-components/macro';
import { normal, sm, xs, md, lg } from './mixins';
import { colors } from 'components/Styles/Colors';

export const StyledText = styled.p`
  ${normal}

  &.xs {
    ${xs};
  }

  &.sm {
    ${sm};
  }

  &.md {
    ${md};
  }

  &.lg {
    ${lg}
  }

  &.bold {
    font-weight: 600;
  }

  &.center {
    text-align: center;
  }
`;

export const Text = ({ children, className, color = colors.grayText }) => {
  return (
    <StyledText className={`plain-text ${className}`} $color={color}>
      {children}
    </StyledText>
  );
};
