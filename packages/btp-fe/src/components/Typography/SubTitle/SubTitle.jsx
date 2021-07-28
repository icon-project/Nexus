import styled from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';

import { normal, sm, md, lg } from './mixins';

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
    font-weight: 600;
  }
`;

export const SubTitle = ({ children, className, color = colors.grayText }) => {
  return (
    <StyledSubTitle className={`subtitle-text ${className}`} $color={color}>
      {children}
    </StyledSubTitle>
  );
};
