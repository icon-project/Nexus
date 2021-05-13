import { Layout } from 'components/Layout';
import { TransferCard } from 'components/TransferCard';
import styled from 'styled-components';

const TransferStyled = styled(Layout)`
  .transfer-card {
    padding-top: 82px;
    display: flex;
    justify-content: center;
  }
`;
const Transfer = () => {
  return (
    <TransferStyled>
      <div className="transfer-card">
        <TransferCard />
      </div>
    </TransferStyled>
  );
};

export default Transfer;
