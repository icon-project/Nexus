import styled from 'styled-components/macro';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '../Styles/Colors';

const Wrapper = styled.p`
  > a.md {
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    color: ${colors.tertiaryBase};
  }

  > a.xs {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.75px;
    color: ${colors.tertiaryBase};
  }

  > a.sm {
    font-size: 14px;
    line-height: 20px;
  }

  > a.bold {
    font-weight: 500;
  }

  ${({ block, center }) => `
    ${!block ? 'display: inline-block;' : ''}
    ${center ? 'text-align: center;' : ''}
  `}
`;

export const Link = ({ children, to, className, block = true, center, ...props }) => {
  return (
    <Wrapper block={block} center={center}>
      <RouterLink to={to} {...props} className={className}>
        {children}
      </RouterLink>
    </Wrapper>
  );
};
