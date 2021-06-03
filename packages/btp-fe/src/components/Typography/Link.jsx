import styled from 'styled-components/macro';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '../Styles/Colors';

const Wrapper = styled.p`
  a.x-small {
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.75px;
    color: ${colors.tertiaryBase};
  }
  ${({ block, center }) => `
    ${!block ? 'display: inline-block;' : ''}
    ${center ? 'text-align: center;' : ''}
  `}
`;

export const Link = ({ children, props, to, className, block = true, center }) => {
  return (
    <Wrapper block={block} center={center}>
      <RouterLink to={to} {...props} className={className}>
        {children}
      </RouterLink>
    </Wrapper>
  );
};
