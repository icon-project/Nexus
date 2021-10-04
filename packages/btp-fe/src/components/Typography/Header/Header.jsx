import styled from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { normal, sm, xs, md, lg, bold } from './mixins';

const StyledHeader = styled.h3`
  ${normal};
  color: ${({ $color }) => $color};

  &.inline {
    display: inline-block;
  }

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
    ${lg};
  }

  &.bold {
    ${bold};
  }

  &.center {
    text-align: center;
  }

  ${media.md`
    &.md {
      ${sm};
    }
  `};
`;

export const Header = ({ children, className, color = colors.grayText }) => {
  return (
    <StyledHeader className={`header-text ${className}`} $color={color}>
      {children}
    </StyledHeader>
  );
};
