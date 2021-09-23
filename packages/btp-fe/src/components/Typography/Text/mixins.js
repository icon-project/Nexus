import { css } from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';

export const normal = css`
  font-weight: 300;
  letter-spacing: 0.75px;
  color: ${colors.grayText};
`;

export const xs = css`
  font-size: 12px;
  line-height: 16px;
`;

export const sm = css`
  ${normal};
  font-size: 14px;
  line-height: 20px;
`;

export const md = css`
  ${normal};
  font-size: 16px;
  line-height: 24px;
`;

export const lg = css`
  font-size: 50px;
  line-height: 68px;
`;

export const smBold = css`
  ${normal}
  ${sm};
  font-weight: 500;
`;

export const xsBold = css`
  ${normal};
  ${xs};
  font-weight: 500;
`;
