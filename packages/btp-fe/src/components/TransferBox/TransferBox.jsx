import styled from 'styled-components/macro';

import { Details } from './Details';
import { colors } from '../Styles/Colors';

const Wrapper = styled.div`
  width: 480px;
  background-color: ${colors.grayBG};

  padding: 23px 0 0;
`;

export const TransferBox = () => {
  return (
    <Wrapper>
      <Details />
    </Wrapper>
  );
};
