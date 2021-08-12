import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { PrimaryButton } from 'components/Button';
import { Helmet } from 'components/Helmet';
import { TransferBox } from 'components/TransferBox';
import { SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

import { EthereumInstance } from 'connectors/MetaMask';

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
      <Helmet title="Transfer" />

      <NavLink to={`/transfer/history`}>
        <SubTitle className="sm bold" color={colors.tertiaryBase}>
          Transfer history
        </SubTitle>
      </NavLink>

      <div className="transfer-card">
        <TransferBox />
      </div>
      <PrimaryButton
        onClick={() => {
          EthereumInstance.setApprovalForAll();
        }}
      >
        Set Approve
      </PrimaryButton>
    </TransferStyled>
  );
};

export default Transfer;
