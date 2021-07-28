import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { TransferBox } from 'components/TransferBox';
import { SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

const TransferStyled = styled.div`
  padding-top: 43px;
  max-width: 480px;
  margin: 0 auto;
  text-align: right;

  .transfer-card {
    display: flex;
    justify-content: center;
    padding-bottom: 43px;
  }

  a > .subtitle-text {
    display: inline-block;
    margin: 0 auto 19px;
  }
`;
const Transfer = () => {
  return (
    <TransferStyled>
      <NavLink to={`/transfer/history`}>
        <SubTitle className="sm bold history-link" color={colors.tertiaryBase}>
          Transfer history
        </SubTitle>
      </NavLink>

      <div className="transfer-card">
        <TransferBox />
      </div>
    </TransferStyled>
  );
};

export default Transfer;
