import styled from 'styled-components/macro';
import { Icon } from 'components/Icon';
import { TextMixin } from 'components/Typography/Text';

const Wrapper = styled.h4`
  ${TextMixin.md};
  margin-bottom: 0;

  &.uppercase {
    text-transform: uppercase;
  }

  & > .icon,
  & > img {
    margin-right: 8px;
    vertical-align: middle;
  }
`;

export const TextWithIcon = ({ children, className, ...props }) => {
  return (
    <Wrapper className={className}>
      <Icon {...props} />
      {children}
    </Wrapper>
  );
};
