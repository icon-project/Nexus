import styled from 'styled-components';
import { Icon } from 'components/Icon';
import { TextMixin } from 'components/Typography/Text';

const Wrapper = styled.h4`
  ${TextMixin.md};
  margin-bottom: 0;

  &.uppercase {
    text-transform: uppercase;
  }

  & > img {
    margin-right: 8px;
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
