import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { TransferBox } from 'components/TransferBox';
import { Icon } from 'components/Icon';
import { SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

import { ReactComponent as bchIcon } from 'assets/images/blue-back-arrow.svg';

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
        <SubTitle className="sm bold" color={colors.tertiaryBase}>
          Transfer history
        </SubTitle>
      </NavLink>

      <div className="transfer-card">
        <TransferBox />
      </div>
      <Icon SVGComp={bchIcon} color="white" />
    </TransferStyled>
  );
};

export default Transfer;
