import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { TransferBox } from 'components/TransferBox';
import { SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

const TransferStyled = styled.div`
  .transfer-card {
    display: flex;
    justify-content: center;
    padding-bottom: 43px;
  }
  .history-link {
    text-align: right;
    color: ${colors.tertiaryBase};
    width: 480px;
    margin: 43px 0 19px;
    cursor: pointer;
  }
  .history-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;
const Transfer = () => {
  return (
    <TransferStyled>
      <NavLink to={`/transfer/history`}>
        <div className="history-container">
          <SubTitle className="small bold history-link">Transfer history</SubTitle>
        </div>
      </NavLink>

      <div className="transfer-card">
        <TransferBox />
      </div>
    </TransferStyled>
  );
};

export default Transfer;
