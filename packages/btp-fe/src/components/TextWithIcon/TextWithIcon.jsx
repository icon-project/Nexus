import styled from 'styled-components';
import { Icon } from 'components/Icon';
import { mediumText } from 'components/Typography/Text';

const Wrapper = styled.h4`
  ${mediumText};

  & > img {
    margin-right: 8px;
  }
`;

export const TextWithIcon = ({ children, ...props }) => {
  return (
    <Wrapper>
      <Icon {...props} />
      {children}
    </Wrapper>
  );
};
