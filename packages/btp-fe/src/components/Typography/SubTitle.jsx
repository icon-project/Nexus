import styled, { css } from 'styled-components/macro';
import { colors } from '../Styles/Colors';

const normalSubTitle = css`
  letter-spacing: 1px;
  font-weight: 400;
  color: ${colors.grayText};
`;

export const SubTitle = styled.h3`
  ${normalSubTitle}

  &.large {
    font-size: 18px;
    line-height: 24px;
  }

  &.bold {
    font-weight: 600;
  }
`;
