import styled, { css } from 'styled-components/macro';
import { colors } from '../Styles/Colors';

const normalHeader = css`
  letter-spacing: 1px;
  color: ${colors.grayText};
`;

export const mediumBoldHeader = css`
  ${normalHeader}
  font-size: 36px;
  line-height: 48px;
  font-weight: 600;
`;

export const Header = styled.h3`
  ${normalHeader}

  &.x-small {
    font-size: 21px;
    line-height: 28px;
  }

  &.small {
    font-size: 25px;
    line-height: 36px;
  }

  &.medium {
    font-size: 36px;
    line-height: 48px;
  }

  &.large {
    font-size: 50px;
    line-height: 68px;
  }

  &.bold {
    font-weight: 600;
  }
`;
