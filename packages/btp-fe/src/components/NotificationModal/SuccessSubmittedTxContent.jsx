import styled from 'styled-components/macro';
import { Link, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import arrowIcon from 'assets/images/blue-up-arrow.svg';

const Wrapper = styled.div`
  text-align: center;
  margin-top: 22.7px;

  a.sm {
    color: ${colors.tertiaryBase};
    margin-top: 14px;
    display: inline-block;

    > img {
      width: 12.27px;
      height: 12.27px;
      margin-left: 12px;
      vertical-align: middle;
    }
  }
`;

export const SuccessSubmittedTxContent = ({ setDisplay, txHash }) => {
  return (
    <Wrapper id="success-tx-modal">
      <Text className="md">Your transaction was submitted successfully.</Text>
      <Link
        className="sm bold"
        to={'/history/' + txHash}
        center
        onClick={() => {
          setDisplay(false);
        }}
      >
        View on history
        <img src={arrowIcon} alt="icon" />
      </Link>
    </Wrapper>
  );
};
