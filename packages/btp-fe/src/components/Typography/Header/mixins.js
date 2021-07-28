import { css } from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';

export const normal = css`
  letter-spacing: 1px;
  font-weight: 400;
  color: ${colors.grayText};
`;

export const xs = css`
  font-size: 21px;
  line-height: 28px;
`;

export const sm = css`
  font-size: 25px;
  line-height: 36px;
`;

export const md = css`
  font-size: 36px;
  line-height: 48px;
`;

export const lg = css`
  font-size: 50px;
  line-height: 68px;
`;

export const mdBold = css`
  ${normal};
  ${md};
  font-weight: 600;
`;

export const smBold = css`
  ${normal};
  ${sm};
  font-weight: 600;
`;
