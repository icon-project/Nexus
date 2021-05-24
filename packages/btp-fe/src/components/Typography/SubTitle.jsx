import styled, { css } from 'styled-components/macro';
import { colors } from '../Styles/Colors';

const normalSubTitle = css`
  letter-spacing: 1px;
  font-weight: 400;
  color: ${colors.grayText};
`;

export const smallBoldSubtitle = css`
  ${normalSubTitle};

  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
`;

export const mediumBoldSubtitle = css`
  ${normalSubTitle};

  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

export const SubTitle = styled.h3`
  ${normalSubTitle}

  &.small {
    font-size: 14px;
    line-height: 20px;
  }

  &.medium {
    font-size: 16px;
    line-height: 24px;
  }

  &.large {
    font-size: 18px;
    line-height: 24px;
  }

  &.bold {
    font-weight: 600;
  }
`;
