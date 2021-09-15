import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { Header } from 'components/Typography';
import backIcon from '../../assets/images/arrow-icon.svg';

const StyledBackButton = styled.button`
  background-color: transparent;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 8px;
    background: transparent center / contain no-repeat url('${backIcon}');
    transform: rotate(90deg);
    margin-right: 25.5px;
  }
`;

export const BackButton = ({ children, onClick, url }) => {
  const { goBack, push } = useHistory();

  const onBack = url
    ? () => {
        push(url);
      }
    : goBack;

  return (
    <StyledBackButton type="button" onClick={onClick || onBack}>
      <Header className="md bold">{children}</Header>
    </StyledBackButton>
  );
};
