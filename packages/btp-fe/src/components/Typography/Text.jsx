import styled, { css } from 'styled-components/macro';
import { colors } from '../Styles/Colors';

const normalText = css`
  font-weight: 400;
  letter-spacing: 0.75px;
  color: ${colors.grayText};
`;

export const mediumText = css`
  ${normalText}
  font-size: 16px;
  line-height: 24px;
`;

export const smallText = css`
  ${normalText}
  font-size: 14px;
  line-height: 20px;
`;

export const Text = styled.p`
  ${normalText}

  &.medium {
    font-size: 16px;
    line-height: 24px;
  }

  &.small {
    font-size: 14px;
    line-height: 20px;
  }

  &.x-small {
    font-size: 12px;
    line-height: 16px;
  }

  &.bold {
    font-weight: 600;
  }
`;

/* Link/X-Small: Text/x-small/bold */
