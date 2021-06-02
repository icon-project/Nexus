import { useState } from 'react';
import styled from 'styled-components';

import { TransferCard } from 'components/TransferCard';
import { TransferHistory } from 'components/TransferHistory';

const TransferStyled = styled.div`
  .transfer-card {
    display: flex;
    justify-content: center;
  }
  .history-link {
    color: #7fdeff;
    font-size: 14px;
    line-height: 20px;
    width: max-content;
    letter-spacing: 1px;
    width: 480px;
    display: flex;
    justify-content: flex-end;
    padding: 43px 10px 19px 0;
    span {
      cursor: pointer;
    }
  }
  .history-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .back-to-transfer {
    font-weight: 600;
    font-size: 36px;
    line-height: 48px;
    letter-spacing: 1px;
    color: #eff1ed;
    cursor: pointer;
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
            <div className="history-link">
              <span onClick={() => openTransferHistory()}>Transfer history</span>
            </div>
          </div>
          <div className="transfer-card">
            <TransferCard />
          </div>
        </>
      )}
    </TransferStyled>
  );
};

export default Transfer;
