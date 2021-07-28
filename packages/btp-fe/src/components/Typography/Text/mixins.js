import { css } from 'styled-components/macro';
import { colors } from 'components/Styles/Colors';

const normal = css`
  font-weight: 400;
  letter-spacing: 0.75px;
  color: ${colors.grayText};
`;

export const xs = css`
  font-size: 12px;
  line-height: 16px;
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
  font-size: 50px;
  line-height: 68px;
`;

export const smBold = css`
  ${normal}
  ${sm};
  font-weight: 600;
`;

export const xsBold = css`
  ${normal};
  ${xs};
  font-weight: 600;
`;
