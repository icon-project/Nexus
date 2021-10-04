import styled from 'styled-components/macro';
import { Link as RouterLink } from 'react-router-dom';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { TextMixin } from 'components/Typography/Text';

import { colors } from '../Styles/Colors';

const Wrapper = styled.p`
  > a.md {
    ${SubTitleMixin.md};
    color: ${colors.tertiaryBase};
  }

  > a.xs {
    ${TextMixin.xsBold};
    color: ${colors.tertiaryBase};
  }

  > a.sm {
    font-size: 14px;
    line-height: 20px;
  }

  > a.bold {
    ${TextMixin.bold};
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
