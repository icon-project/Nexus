import { css } from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';

export const normal = css`
  letter-spacing: 1px;
  font-weight: 300;
  color: ${colors.grayText};
`;

export const sm = css`
  font-size: 14px;
  line-height: 20px;
`;

export const md = css`
  font-size: 16px;
  line-height: 24px;
`;

export const lg = css`
  font-size: 18px;
  line-height: 24px;
`;

export const smBold = css`
  ${normal};
  ${sm};
  font-weight: 500;
`;

export const mdBold = css`
  ${normal};
  ${md};
  font-weight: 500;
`;
