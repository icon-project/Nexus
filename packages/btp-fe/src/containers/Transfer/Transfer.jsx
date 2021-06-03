import { useState } from 'react';
import styled from 'styled-components';

import { TransferHistory } from 'components/TransferHistory';
import { TransferBox } from 'components/TransferBox';
import { SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

const TransferStyled = styled.div`
  .transfer-card {
    display: flex;
    justify-content: center;
  }
  .history-link {
    text-align: right;
    color: ${colors.tertiaryBase};
    width: 480px;
    padding: 43px 10px 19px 0;
    cursor: pointer;
  }
  .history-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;
const Transfer = () => {
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const openTransferHistory = () => {
    setIsOpenHistory(!isOpenHistory);
  };
  return (
    <TransferStyled>
      {isOpenHistory ? (
        <div className="history-container">
          <TransferHistory setIsOpenHistory={setIsOpenHistory} />
        </div>
      ) : (
        <>
          <div className="history-container">
            <SubTitle className="small bold history-link" onClick={openTransferHistory}>
              Transfer history
            </SubTitle>
          </div>
          <div className="transfer-card">
            <TransferBox />
          </div>
        </>
      )}
    </TransferStyled>
  );
};

export default Transfer;
