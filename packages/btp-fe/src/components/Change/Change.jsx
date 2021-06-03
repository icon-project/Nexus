import styled from 'styled-components';
import IncreaseIcon from 'assets/images/increase.svg';
import DecreaseIcon from 'assets/images/decrease.svg';

import { Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

const ChangeStyled = styled.div`
  vertical-align: bottom;
  .percent {
    font-size: 12px;
    display: inline-block;
    color: ${({ status }) => (status === 'increase' ? colors.successState : colors.errorState)};
  }
  img {
    margin-right: 5.67px;
  }
  p {
    display: inline-block;
    margin-right: 9.33px;
  }
`;
const Change = ({ status, value, percent }) => {
  return (
    <ChangeStyled status={status}>
      <Text className="large bold">{value}</Text>
      {status === 'increase' ? (
        <img src={IncreaseIcon} alt="increase" />
      ) : (
        <img src={DecreaseIcon} alt="decrease" />
      )}
      <span className="percent">{percent}</span>
    </ChangeStyled>
  );
};

export default Change;
