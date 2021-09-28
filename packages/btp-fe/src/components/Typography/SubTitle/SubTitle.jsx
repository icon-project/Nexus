import styled from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';

import { normal, sm, md, lg, bold } from './mixins';

const StyledSubTitle = styled.h4`
  ${normal};
  color: ${({ $color }) => $color};

  &.sm {
    ${sm};
  }

  &.md {
    ${md};
  }

  &.lg {
    ${lg};
  }

  &.bold {
    ${bold};
  }
`;

export const SubTitle = ({ children, className, color = colors.grayText }) => {
  return (
    <StyledSubTitle className={`subtitle-text ${className}`} $color={color}>
      {children}
    </StyledSubTitle>
  );
};
