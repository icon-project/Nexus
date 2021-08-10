import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { Helmet } from 'components/Helmet';
import { TransferBox } from 'components/TransferBox';
import { PrimaryButton } from 'components/Button';
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
      <PrimaryButton onClick={() => EthereumInstance.transferNativeCoin()}>
        Send Native coin
      </PrimaryButton>
      <PrimaryButton onClick={() => EthereumInstance.getRS()}>Get RS</PrimaryButton>
    </TransferStyled>
  );
};

export default Transfer;
