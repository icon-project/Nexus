import styled from 'styled-components/macro';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '../Styles/Colors';

const Wrapper = styled.p`
  > a.medium {
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    color: ${colors.tertiaryBase};
  }

  > a.x-small {
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.75px;
    color: ${colors.tertiaryBase};
  }

  > a.small {
    font-size: 14px;
    line-height: 20px;
  }

  > a.bold {
    font-weight: 600;
  }

  ${({ block, center }) => `
    ${!block ? 'display: inline-block;' : ''}
    ${center ? 'text-align: center;' : ''}
  `}
  > a.bold {
    font-weight: 600;
  }
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
